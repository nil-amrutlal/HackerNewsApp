export interface Story {
    id : Number;
    deleted ?: boolean;
    type : string;
    by ?: string;
    time ?: Number;
    dead ?: boolean;
    kids ?: Number[];
    descendants ?: Number;
    score ?: Number;
    title ?: string;
    url ?: string
  }