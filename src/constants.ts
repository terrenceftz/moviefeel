import { Movie } from "./types";

export const INITIAL_MOVIES: Movie[] = [
  {
    id: "1",
    title: "In the Mood for Love",
    director: "Wong Kar-wai",
    year: 2000,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMzY1ZGNmZmYtZGJhNy00ZGVmLTliYjctYmExYjkyNTQwY2JkXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/m99A8mEqX7SBeuSj9S7y992Uvnt.jpg",
    tmdbRating: 8.1,
    userRating: 9.5,
    isFavorite: true,
    overview: "电影讲述了报片编辑周慕云与其邻居苏丽珍在那一段特殊的时光里，产生的某种微妙但最终遗憾的情感。",
    userComment: "渴望与错过交织的杰作。每一帧都是一幅静谧欲望的画作。",
    viewingDate: "2024-03-15",
    genre: ["剧情", "爱情"],
    quote: "如果有多一张船票，你会不会跟我一起走？",
    moodTags: ["#忧郁", "#浪漫", "#怀旧"],
    primaryColor: "#8B0000",
    emotionalProfile: [
      { label: "渴望", intensity: 95 },
      { label: "画面", intensity: 100 },
      { label: "节奏", intensity: 40 },
      { label: "情感", intensity: 90 },
      { label: "含蓄", intensity: 98 }
    ]
  },
  {
    id: "2",
    title: "银翼杀手 2049",
    director: "丹尼斯·维伦纽瓦",
    year: 2017,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMjA5OTYzNjcxN15BMl5BanBnXkFtZTgwNjI5NDI3MjI@._V1_FMjpg_UX1000_.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/8S9U0vCAnN1S6p8q72K86VstcR4.jpg",
    tmdbRating: 8.0,
    userRating: 9.2,
    isFavorite: true,
    overview: "在三十年后，一名新的银翼杀手K揭开了一个埋藏已久的秘密，这个秘密有潜力将社会仅存的秩序推向混乱。K的发现促使他去寻找已经失踪三十年的前银翼杀手里克·戴克。",
    userComment: "最壮丽的科幻片之一。它像一场斥巨资打造的宏大幻梦。",
    viewingDate: "2024-04-10",
    genre: ["科幻", "黑色电影"],
    quote: "有时为了爱一个人，你必须成为陌生人。",
    moodTags: ["#寂静", "#史诗", "#硬核"],
    primaryColor: "#FF8C00",
    emotionalProfile: [
      { label: "宏大", intensity: 98 },
      { label: "画面", intensity: 100 },
      { label: "节奏", intensity: 50 },
      { label: "配乐", intensity: 95 },
      { label: "深度", intensity: 88 }
    ]
  },
  {
    id: "3",
    title: "完美的日子",
    director: "维姆·文德斯",
    year: 2023,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BN2E0OTllODAtOGI5OC00NGE0LWE2NzItMDVlMGRjMGVlZWIyXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/eGqP8Rk99fK4Z7w0X7Pz6C97FvB.jpg",
    tmdbRating: 7.9,
    userRating: 8.8,
    isFavorite: false,
    overview: "平山似乎对简单的生活完全满足。他过着高度结构化的生活，把自己的一天奉献给清洁东京公厕的工作。",
    userComment: "极简生活的诗意。平淡中蕴含着巨大的感力量。",
    viewingDate: "2024-05-01",
    genre: ["剧情"],
    quote: "下次是下次。现在是现在。",
    moodTags: ["#治愈", "#极简", "#日常"],
    primaryColor: "#87CEEB",
    emotionalProfile: [
      { label: "宁静", intensity: 100 },
      { label: "画面", intensity: 85 },
      { label: "节奏", intensity: 30 },
      { label: "愉悦", intensity: 70 },
      { label: "省思", intensity: 95 }
    ]
  }
];
