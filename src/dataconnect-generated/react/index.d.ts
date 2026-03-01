import { ListAllProjectsData, GetUserPostsData, GetUserPostsVariables, CreateNewProjectData, CreateNewProjectVariables, AddCommentToProjectData, AddCommentToProjectVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useListAllProjects(options?: useDataConnectQueryOptions<ListAllProjectsData>): UseDataConnectQueryResult<ListAllProjectsData, undefined>;
export function useListAllProjects(dc: DataConnect, options?: useDataConnectQueryOptions<ListAllProjectsData>): UseDataConnectQueryResult<ListAllProjectsData, undefined>;

export function useGetUserPosts(vars: GetUserPostsVariables, options?: useDataConnectQueryOptions<GetUserPostsData>): UseDataConnectQueryResult<GetUserPostsData, GetUserPostsVariables>;
export function useGetUserPosts(dc: DataConnect, vars: GetUserPostsVariables, options?: useDataConnectQueryOptions<GetUserPostsData>): UseDataConnectQueryResult<GetUserPostsData, GetUserPostsVariables>;

export function useCreateNewProject(options?: useDataConnectMutationOptions<CreateNewProjectData, FirebaseError, CreateNewProjectVariables>): UseDataConnectMutationResult<CreateNewProjectData, CreateNewProjectVariables>;
export function useCreateNewProject(dc: DataConnect, options?: useDataConnectMutationOptions<CreateNewProjectData, FirebaseError, CreateNewProjectVariables>): UseDataConnectMutationResult<CreateNewProjectData, CreateNewProjectVariables>;

export function useAddCommentToProject(options?: useDataConnectMutationOptions<AddCommentToProjectData, FirebaseError, AddCommentToProjectVariables>): UseDataConnectMutationResult<AddCommentToProjectData, AddCommentToProjectVariables>;
export function useAddCommentToProject(dc: DataConnect, options?: useDataConnectMutationOptions<AddCommentToProjectData, FirebaseError, AddCommentToProjectVariables>): UseDataConnectMutationResult<AddCommentToProjectData, AddCommentToProjectVariables>;
