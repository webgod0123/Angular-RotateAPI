export class Post {
    postID: string;
    userID: number;
    type: string | null;
    topicID: number | null;
    tone: string | null;
    title: string | null;
    parentPostID: string | null;
    alphaPostID: string | null;
    body: string;
    timestamp: Date;
    reviewed : boolean;
    bannerImage : string | null;
    privated : boolean | null;
    edited : boolean;
    delete : boolean;
  }
  