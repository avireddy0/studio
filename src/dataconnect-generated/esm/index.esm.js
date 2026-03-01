import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'studio',
  location: 'us-central1'
};

export const listAllProjectsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllProjects');
}
listAllProjectsRef.operationName = 'ListAllProjects';

export function listAllProjects(dc) {
  return executeQuery(listAllProjectsRef(dc));
}

export const getUserPostsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserPosts', inputVars);
}
getUserPostsRef.operationName = 'GetUserPosts';

export function getUserPosts(dcOrVars, vars) {
  return executeQuery(getUserPostsRef(dcOrVars, vars));
}

export const createNewProjectRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewProject', inputVars);
}
createNewProjectRef.operationName = 'CreateNewProject';

export function createNewProject(dcOrVars, vars) {
  return executeMutation(createNewProjectRef(dcOrVars, vars));
}

export const addCommentToProjectRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddCommentToProject', inputVars);
}
addCommentToProjectRef.operationName = 'AddCommentToProject';

export function addCommentToProject(dcOrVars, vars) {
  return executeMutation(addCommentToProjectRef(dcOrVars, vars));
}

