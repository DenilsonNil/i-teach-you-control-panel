export interface LessonViewModel {
  id: string;
  title: string;
  createdAt: string;
}

export interface SubjectViewModel {
  id: string;
  name: string;
  lessons: LessonViewModel[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubjectPayload {
  name: string;
  lessons: string[];
}
