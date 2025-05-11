import React from "react";

const comments = [
  {
    id: 1,
    username: "sungjae",
    content: "Lorem Ipsum is simply dummy text of the printing",
    avatar: "", // 실제 이미지가 없으므로 빈 값
  },
  {
    id: 2,
    username: "kihyun",
    content: "Lorem Ipsum is simply dummy text of the printing",
    avatar: "",
  },
  {
    id: 3,
    username: "jiwon",
    content: "Lorem Ipsum is simply dummy text of the printing",
    avatar: "",
  },
];

const CommentZone = () => {
  return (
    <div className="min-h-screen w-[35.625rem]">
      <div className="w-[35.625rem] min-h-screen bg-white rounded-lg border border-gray-300 p-4 mb-4 shadow-sm">
        <div className="font-bold text-lg mb-4">{comments.length}개의 댓글</div>
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
              <div>
                <div className="font-semibold text-base">
                  {comment.username}
                </div>
                <div className="text-gray-500 text-sm">{comment.content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentZone;
