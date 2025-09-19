import { Collection, ObjectId } from "mongodb";
import { getDatabase } from "@/lib/db/mongodb";
import type { SubjectViewModel } from "@/types/subject";

type LessonDocument = {
  _id: ObjectId;
  title: string;
  createdAt: Date;
};

type SubjectDocument = {
  _id: ObjectId;
  name: string;
  normalizedName: string;
  lessons: LessonDocument[];
  createdAt: Date;
  updatedAt: Date;
};

const mapSubject = (subject: SubjectDocument): SubjectViewModel => ({
  id: subject._id.toString(),
  name: subject.name,
  createdAt: subject.createdAt.toISOString(),
  updatedAt: subject.updatedAt.toISOString(),
  lessons: subject.lessons.map((lesson) => ({
    id: lesson._id.toString(),
    title: lesson.title,
    createdAt: lesson.createdAt.toISOString(),
  })),
});

const getSubjectsCollection = async (): Promise<Collection<SubjectDocument>> => {
  const db = await getDatabase();
  return db.collection<SubjectDocument>("subjects");
};

export const findAllSubjects = async (): Promise<SubjectViewModel[]> => {
  const collection = await getSubjectsCollection();
  const subjects = await collection.find({}).sort({ createdAt: -1 }).toArray();
  return subjects.map(mapSubject);
};

export const findSubjectByName = async (name: string) => {
  const collection = await getSubjectsCollection();
  const normalizedName = name.trim().toLowerCase();
  const subject = await collection.findOne({ normalizedName });
  return subject ? mapSubject(subject) : null;
};

export const createSubject = async (name: string, lessonTitles: string[]): Promise<SubjectViewModel> => {
  const collection = await getSubjectsCollection();
  const now = new Date();
  const normalizedName = name.trim().toLowerCase();

  const lessons: LessonDocument[] = lessonTitles.map((title) => ({
    _id: new ObjectId(),
    title,
    createdAt: now,
  }));

  const { insertedId } = await collection.insertOne({
    name,
    normalizedName,
    lessons,
    createdAt: now,
    updatedAt: now,
  });

  return {
    id: insertedId.toString(),
    name,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    lessons: lessons.map((lesson) => ({
      id: lesson._id.toString(),
      title: lesson.title,
      createdAt: lesson.createdAt.toISOString(),
    })),
  };
};

export const appendLessonsToSubject = async (
  subjectId: string,
  lessonTitles: string[],
): Promise<SubjectViewModel | null> => {
  const collection = await getSubjectsCollection();
  const existing = await collection.findOne({ _id: new ObjectId(subjectId) });

  if (!existing) {
    return null;
  }

  const existingTitles = new Set(
    existing.lessons.map((lesson) => lesson.title.trim().toLowerCase()),
  );

  const now = new Date();
  const lessonsToAdd: LessonDocument[] = lessonTitles
    .filter((title) => !existingTitles.has(title.trim().toLowerCase()))
    .map((title) => ({
      _id: new ObjectId(),
      title,
      createdAt: now,
    }));

  if (lessonsToAdd.length === 0) {
    return mapSubject(existing);
  }

  const updatedLessons = [...existing.lessons, ...lessonsToAdd];
  await collection.updateOne(
    { _id: existing._id },
    {
      $set: {
        lessons: updatedLessons,
        updatedAt: now,
      },
    },
  );

  return mapSubject({
    ...existing,
    lessons: updatedLessons,
    updatedAt: now,
  });
};
