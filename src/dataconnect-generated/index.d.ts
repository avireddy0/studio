import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AddCommentToProjectData {
  comment_insert: Comment_Key;
}

export interface AddCommentToProjectVariables {
  projectId: UUIDString;
  content: string;
}

export interface Comment_Key {
  id: UUIDString;
  __typename?: 'Comment_Key';
}

export interface CreateNewProjectData {
  project_insert: Project_Key;
}

export interface CreateNewProjectVariables {
  title: string;
  description: string;
  appStoreLink?: string | null;
  githubLink?: string | null;
  videoLink?: string | null;
  screenshots?: string[] | null;
  tags?: string[] | null;
}

export interface GetUserPostsData {
  posts: ({
    id: UUIDString;
    title: string;
    content: string;
    createdAt: TimestampString;
    updatedAt: TimestampString;
    type: string;
    tags?: string[] | null;
  } & Post_Key)[];
}

export interface GetUserPostsVariables {
  userId: UUIDString;
}

export interface Like_Key {
  userId: UUIDString;
  projectId: UUIDString;
  __typename?: 'Like_Key';
}

export interface ListAllProjectsData {
  projects: ({
    id: UUIDString;
    title: string;
    description: string;
    user: {
      id: UUIDString;
      displayName: string;
    } & User_Key;
      createdAt: TimestampString;
      tags?: string[] | null;
  } & Project_Key)[];
}

export interface Post_Key {
  id: UUIDString;
  __typename?: 'Post_Key';
}

export interface Project_Key {
  id: UUIDString;
  __typename?: 'Project_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface ListAllProjectsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllProjectsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllProjectsData, undefined>;
  operationName: string;
}
export const listAllProjectsRef: ListAllProjectsRef;

export function listAllProjects(): QueryPromise<ListAllProjectsData, undefined>;
export function listAllProjects(dc: DataConnect): QueryPromise<ListAllProjectsData, undefined>;

interface GetUserPostsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserPostsVariables): QueryRef<GetUserPostsData, GetUserPostsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserPostsVariables): QueryRef<GetUserPostsData, GetUserPostsVariables>;
  operationName: string;
}
export const getUserPostsRef: GetUserPostsRef;

export function getUserPosts(vars: GetUserPostsVariables): QueryPromise<GetUserPostsData, GetUserPostsVariables>;
export function getUserPosts(dc: DataConnect, vars: GetUserPostsVariables): QueryPromise<GetUserPostsData, GetUserPostsVariables>;

interface CreateNewProjectRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewProjectVariables): MutationRef<CreateNewProjectData, CreateNewProjectVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateNewProjectVariables): MutationRef<CreateNewProjectData, CreateNewProjectVariables>;
  operationName: string;
}
export const createNewProjectRef: CreateNewProjectRef;

export function createNewProject(vars: CreateNewProjectVariables): MutationPromise<CreateNewProjectData, CreateNewProjectVariables>;
export function createNewProject(dc: DataConnect, vars: CreateNewProjectVariables): MutationPromise<CreateNewProjectData, CreateNewProjectVariables>;

interface AddCommentToProjectRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddCommentToProjectVariables): MutationRef<AddCommentToProjectData, AddCommentToProjectVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddCommentToProjectVariables): MutationRef<AddCommentToProjectData, AddCommentToProjectVariables>;
  operationName: string;
}
export const addCommentToProjectRef: AddCommentToProjectRef;

export function addCommentToProject(vars: AddCommentToProjectVariables): MutationPromise<AddCommentToProjectData, AddCommentToProjectVariables>;
export function addCommentToProject(dc: DataConnect, vars: AddCommentToProjectVariables): MutationPromise<AddCommentToProjectData, AddCommentToProjectVariables>;

