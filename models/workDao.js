const myDataSource = require('.');
const res = require('express/lib/response');

// 카테고리별 총 게시물 수 + 최신 feed list

const findQueryCatagorySortCountList = `
    SELECT 
      wc.id, 
      wc.category_name, 
      wc.eng_category_name, 
      count(*) category_cnt 
    FROM Works_Category wc 
    LEFT JOIN Works_Posting wp 
      ON wc.id = wp.category_id 
    GROUP BY wc.id
    `;

const findQueryWorksFeedList = `
    with tables1 AS (
      SELECT
        wp.id as id, 
        COUNT(*) as comment_cnt 
      FROM Works_Posting wp 
      JOIN Comment c
        ON wp.id = c.posting_id 
      GROUP BY wp.id 
    ), 
    
    tables2 AS (
      SELECT 
        wp.id as id, 
        COUNT(*) AS sympathy_cnt 
      FROM Works_Posting wp 
      JOIN Works_Sympathy_Count wsc 
        ON wp.id = wsc.posting_id 
      LEFT JOIN Works_Sympathy ws 
       ON wsc.sympathy_id = ws.id 
      GROUP BY wp.id 
    ), 
    
    tables3 AS (
      SELECT
        id, 
        posting_id, 
        upload_url AS img_url 
        FROM upload_file
      WHERE 
        (posting_id, id) 
        IN (
          SELECT 
            posting_id, 
            MAX(id) 
          FROM upload_file 
          WHERE file_sort_id = 1 
          GROUP BY posting_id ) 
        ) 
    `;

const worksList = async sort => {
  try {
    if (!sort) {
      const categorySortCountList = await myDataSource.query(
        `${findQueryCatagorySortCountList}`
      );
      const worksFeedList = await myDataSource.query(
        `${findQueryWorksFeedList}
        SELECT 
        wp.id, 
        u.kor_name AS nickname, 
        u.profile_image,  
        c.img_url, 
        wp.title, 
        IFNULL(a.comment_cnt, '0') comment_cnt, 
        IFNULL(b.sympathy_cnt, '0') sympathy_cnt, 
        wp.view_count, 
        SUBSTRING(wp.created_at,1,10) AS created_at
      FROM Works_Posting wp 
      LEFT JOIN Users u 
        ON wp.user_id = u.id 
      LEFT JOIN tables3 c 
        ON c.posting_id = wp.id
      LEFT JOIN tables1 a 
        ON a.id = wp.id 
      LEFT JOIN tables2 b 
        ON b.id = wp.id 
      ORDER BY wp.created_at DESC 
        `
      );
      let result = { categorySortCountList, worksFeedList };
      return result;
    } else {
      const categorySortCountList = await myDataSource.query(
        `${findQueryCatagorySortCountList}`
      );
      // sort 종류 ('recommendpoint', 'sympathycnt')
      const worksFeedList = await myDataSource.query(
        `
        ${findQueryWorksFeedList}

        SELECT 
          CONCAT(
            b.sympathy_cnt + a.comment_cnt
            ) recommendpoint, 
          wp.id, u.kor_name as nickname, 
          u.profile_image, 
          c.img_url, wp.title, 
          IFNULL(a.comment_cnt, '0') comment_cnt, 
          IFNULL(b.sympathy_cnt, '0') sympathycnt, 
          wp.view_count, 
          SUBSTRING(wp.created_at,1,10) as created_at
        FROM Works_Posting wp 
        LEFT JOIN Users u 
          ON wp.user_id = u.id 
        LEFT JOIN tables3 c 
          ON c.posting_id = wp.id
        LEFT JOIN tables1 a 
          ON a.id = wp.id 
        LEFT JOIN tables2 b 
          ON b.id = wp.id 
        ORDER BY ${sort} DESC 
        `
      );
      let result = { categorySortCountList, worksFeedList };
      return result;
    }
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

// feed 글쓴이와 유저와의 팔로우 관계
const followCheck = async (id, user_id) => {
  try {
    console.log('user_id =', user_id);
    return await myDataSource
      .query(
        `
      SELECT
        EXISTS (
          SELECT
            f.id
          FROM
            Follow f
          LEFT JOIN Works_Posting wp ON
            wp.user_id = f.following_id
          WHERE
            wp.id = '${id}'
            AND follower_id = '${user_id}'
        ) AS success
    `
      )
      .then(value => {
        const [item] = value;
        return {
          follow_check: item.success == 1,
        };
      });
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

// feed 상세
const feed = async id => {
  try {
    // feed img_url 배열(다수의 이미지가 있을 시)
    let feedImgArr = await myDataSource.query(
      `
      SELECT
        COUNT(uf.upload_url) file_cnt,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            "file_sort",
            fs.file_sort,
            "img_url",
            uf.upload_url
          )
        ) AS fileInfo
      FROM
        upload_file uf
      LEFT JOIN file_sort fs ON
        uf.file_sort_id = fs.id
      WHERE
        uf.posting_id = '${id}'
        AND uf.file_sort_id = 1
      `
    );
    feedImgArr = [...feedImgArr].map(item => {
      return {
        ...item,
        fileInfo: JSON.parse(item.fileInfo),
      };
    });

    // feed 정보와 사용자 정보 + 태그 카운트
    let feedWithTags = await myDataSource.query(
      `
      SELECT
        wp.id, 
        wp.user_id,
        u.kor_name,
        wp.title,
        wp.content,
        wp.view_count, 
              ps.status,
        SUBSTRING(wp.created_at, 1, 10) AS created_at,
        u.nickname,
        u.profile_image,
              COUNT(wpt.id) AS tag_cnt,
              JSON_ARRAYAGG(
                JSON_OBJECT(
                  "tag_name",
        wtn.name
                )
              ) AS tagInfo
      FROM
        Works_Posting wp
      JOIN Users u ON
        wp.user_id = u.id
      JOIN public_status ps ON
        wp.status_id = ps.id
      JOIN Works_Category wc ON
        wc.id = wp.category_id
      LEFT JOIN Works_Posting_tags wpt ON
        wp.id = wpt.posting_id
      LEFT JOIN Works_tag_names wtn ON
        wpt.tag_id = wtn.id
      WHERE
        wp.id = '${id}'
      `
    );

    feedWithTags = [...feedWithTags].map(item => {
      return {
        ...item,
        tagInfo: JSON.parse(item.tagInfo),
      };
    });

    let feedCommentInfo = await myDataSource.query(
      `
      SELECT
        c.id,
        c.user_id,
        u.kor_name,
        c.comment,
        SUBSTRING(c.created_at, 1, 10) AS created_at ,
        SUBSTRING(c.updated_at, 1, 10) AS updated_at
      FROM
        Comment c
      LEFT JOIN Works_Posting wp ON
        c.posting_id = wp.id
      LEFT JOIN Users u ON
        u.id = c.user_id
      WHERE
        wp.id = '${id}'
      ORDER BY
        created_at ASC      
      `
    );

    // feed 글쓴이의 다른 작품들
    let moreFeedinfo = await myDataSource.query(
      `
      WITH tables1 AS (
        SELECT
          id,
          posting_id,
          upload_url AS img_url,
          SUBSTRING(created_at, 1, 10) AS created_at
        FROM
          upload_file
        WHERE
          (posting_id,
          id)
          IN (
            SELECT
              posting_id,
              MAX(id)
            FROM
              upload_file
            WHERE
              file_sort_id = 1
            GROUP BY
              posting_id )
      ),

      tables2 AS (
        SELECT
          *
        FROM
          Works_Posting wp
        WHERE
          wp.id = '${id}'
      )

      SELECT
        COUNT(wp.id) AS user_feed_cnt,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            "id",
            wp.id,
            "title",
            wp.title,
            "img_url",
            a.img_url,
            "created_at",
            a.created_at
          ) 
        ) AS more_feed
      FROM
        Works_Posting wp
      LEFT JOIN tables1 a ON
        a.id = wp.id
      LEFT JOIN tables2 b ON
        b.user_id = wp.user_id
      WHERE
        wp.user_id = b.user_id
        AND NOT wp.id = '${id}'
      `
    );
    moreFeedinfo = [...moreFeedinfo].map(item => {
      return {
        ...item,
        more_feed: JSON.parse(item.more_feed),
      };
    });

    // feed 글쓴이에 대한 팔로워 정보
    let writerInfo = await myDataSource.query(
      `
      SELECT
        wp.id,
        u.id AS id,
        u.login_id login_id,
        u.kor_name kor_name,
        u.eng_name eng_name,
        u.profile_image profile_image,
        u.nickname nickname,
        COUNT(f.follower_id) AS follower_cnt,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            "follower_id",
            f.follower_id,
            "follower_name",
            u2.nickname
          )
        ) AS follower_list,
        (
          SELECT
            COUNT(f.following_id)
          FROM
            Works_Posting wp
          LEFT JOIN Users u ON
            u.id = wp.user_id
          LEFT JOIN Follow f ON
            f.follower_id = u.id
          LEFT JOIN Users u2 ON
            u2.id = f.following_id
          WHERE
            wp.id = '${id}'
        ) AS following_cnt,
        (
          SELECT
            JSON_ARRAYAGG(
              JSON_OBJECT(
                "following_id",
                f.following_id,
                "following_name",
                u2.nickname
              )
          )
          FROM
            Works_Posting wp
          LEFT JOIN Users u ON
            u.id = wp.user_id
          LEFT JOIN Follow f ON
            f.follower_id = u.id
          LEFT JOIN Users u2 ON
            u2.id = f.following_id
          WHERE
            wp.id = '${id}'
        ) AS following_list
      FROM
        Works_Posting wp
      LEFT JOIN Users u ON
        u.id = wp.user_id
      LEFT JOIN Follow f ON
        f.following_id = u.id
      LEFT JOIN Users u2 ON
        u2.id = f.follower_id
      WHERE
        wp.id = '${id}'
      `
    );

    writerInfo = [...writerInfo].map(item => {
      return {
        ...item,
        follower_list: JSON.parse(item.follower_list),
        following_list: JSON.parse(item.following_list),
      };
    });

    // feed + 총 공감수
    let sympathyCount = await myDataSource.query(
      `
      SELECT
        COUNT(*) AS total_sympathy_cnt
      FROM
        Works_Sympathy_Count wsc
      LEFT JOIN Works_Sympathy ws ON
        ws.id = wsc.sympathy_id
      LEFT JOIN Users u ON
        u.id = wsc.user_id
      LEFT JOIN Works_Posting wp ON
        wsc.posting_id = wp.id
      WHERE
        wp.id = '${id}'
      `
    );

    // feed + 공감별 개수
    let sympathySortCount = await myDataSource.query(
      `
      WITH tables AS (
        SELECT
          wp.id id,
          ws.sympathy_sort sympathy_sort,
          IFNULL(COUNT(wsc.id), '0') AS sympathy_cnt
        FROM
          Works_Sympathy ws
        LEFT JOIN Works_Sympathy_Count wsc ON
          ws.id = wsc.sympathy_id
        LEFT JOIN Users u ON
          u.id = wsc.user_id
        LEFT JOIN Works_Posting wp ON
          wsc.posting_id = wp.id
        WHERE
          wp.id = '${id}'
        GROUP BY
          ws.sympathy_sort
      )
              
      SELECT
        a.id,
        ws.sympathy_sort,
        IFNULL(a.sympathy_cnt, '0') sympathy_cnt
      FROM
        Works_Sympathy ws
      LEFT JOIN tables a ON
        a.sympathy_sort = ws.sympathy_sort
      `
    );

    let anotherFeedList = await myDataSource.query(
      `
      WITH tables1 AS (
        SELECT
          wp.id AS id,
          COUNT(*) AS comment_cnt
        FROM
          Works_Posting wp
        JOIN Comment c ON
          wp.id = c.posting_id
        GROUP BY
          wp.id 
      ),
      tables2 AS (
        SELECT
          wp.id AS id,
          COUNT(*) AS sympathy_cnt
        FROM
          Works_Posting wp
        JOIN Works_Sympathy_Count wsc ON
          wp.id = wsc.posting_id
        LEFT JOIN Works_Sympathy ws ON
          wsc.sympathy_id = ws.id
        GROUP BY
          wp.id 
      ),
      tables3 AS (
        SELECT
          id,
          posting_id,
          upload_url AS img_url
        FROM
          upload_file
        WHERE
          (posting_id,
          id) 
                IN (
          SELECT
            posting_id,
            MAX(id)
          FROM
            upload_file
          WHERE
            file_sort_id = 1
          GROUP BY
            posting_id ) 
      )

      SELECT
        wp.id,
        wp.user_id,
        u.nickname,
        u.profile_image,
        c.img_url,
        wp.title,
        IFNULL(a.comment_cnt, '0') comment_cnt,
        IFNULL(b.sympathy_cnt, '0') sympathy_cnt,
        wp.view_count,
        SUBSTRING(wp.created_at, 1, 10) AS created_at
      FROM
        Works_Posting wp
      LEFT JOIN Users u ON
        wp.user_id = u.id
      LEFT JOIN tables3 c ON
        c.posting_id = wp.id
      LEFT JOIN tables1 a ON
        a.id = wp.id
      LEFT JOIN tables2 b ON
        b.id = wp.id
      WHERE
        wp.id NOT IN ("${id}")
      ORDER BY
        wp.created_at DESC
      `
    );

    // 조회수 카운팅 (IP주소나 시간만료 같은 장치는 아직 없음.)
    const viewCount = await myDataSource.query(
      `
      UPDATE
        Works_Posting
      SET
        view_count = view_count + 1
      WHERE
        id = '${id}'
      `
    );

    let result = {
      feedImgArr,
      feedWithTags,
      feedCommentInfo,
      moreFeedinfo,
      writerInfo,
      sympathyCount,
      sympathySortCount,
      anotherFeedList,
    };
    return result;
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

module.exports = {
  followCheck,
  worksList,
  feed,
};
