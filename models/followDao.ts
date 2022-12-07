import myDataSource from './index';

// feed 글쓴이와 유저와의 팔로우 관계
const getFollowResult = async (id: number, user_id: number) => {
  return await myDataSource
    .query(
      `
      SELECT
          EXISTS(
                  SELECT
                      id
                  FROM
                      Follow f
                  WHERE
                      following_id = ?
                    AND follower_id = ?
              ) AS success
    `,
      [id, user_id]
    )
    .then(value => {
      const [item] = value;
      return {
        follow_check: item.success == 1,
      };
    });
};

// follow여부 확인 유닛
const isFollow = async (following_id: number, user_id: number) => {
  return await myDataSource
    .query(
      `
      SELECT
        count(*) AS follow_check
      FROM
        Follow
      WHERE
        following_id = ?
        AND follower_id = ?
    `,
      [following_id, user_id]
    )
    .then(value => {
      const [item] = value;
      return {
        follow_check: item.follow_check == 1,
      };
    });
};
// follow 체결 관련
const createFollow = async (following_id: number, user_id: number) => {
  await myDataSource.query(
    `
      INSERT
        INTO
        Follow (following_id,
        follower_id)
      VALUES 
        (?,?)
    `,
    [following_id, user_id]
  );
  return isFollow(following_id, user_id);
};

// follow 취소 관련
const deleteFollow = async (following_id: number, user_id: number) => {
  await myDataSource.query(
    `
      DELETE
      FROM
        Follow
      WHERE
        following_id = ?
        AND follower_id = ?
    `,
    [following_id, user_id]
  );
  return isFollow(following_id, user_id);
};

export default { isFollow, getFollowResult, createFollow, deleteFollow };
