# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListAllProjects*](#listallprojects)
  - [*GetUserPosts*](#getuserposts)
- [**Mutations**](#mutations)
  - [*CreateNewProject*](#createnewproject)
  - [*AddCommentToProject*](#addcommenttoproject)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListAllProjects
You can execute the `ListAllProjects` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listAllProjects(): QueryPromise<ListAllProjectsData, undefined>;

interface ListAllProjectsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllProjectsData, undefined>;
}
export const listAllProjectsRef: ListAllProjectsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllProjects(dc: DataConnect): QueryPromise<ListAllProjectsData, undefined>;

interface ListAllProjectsRef {
  ...
  (dc: DataConnect): QueryRef<ListAllProjectsData, undefined>;
}
export const listAllProjectsRef: ListAllProjectsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllProjectsRef:
```typescript
const name = listAllProjectsRef.operationName;
console.log(name);
```

### Variables
The `ListAllProjects` query has no variables.
### Return Type
Recall that executing the `ListAllProjects` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllProjectsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListAllProjects`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllProjects } from '@dataconnect/generated';


// Call the `listAllProjects()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllProjects();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllProjects(dataConnect);

console.log(data.projects);

// Or, you can use the `Promise` API.
listAllProjects().then((response) => {
  const data = response.data;
  console.log(data.projects);
});
```

### Using `ListAllProjects`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllProjectsRef } from '@dataconnect/generated';


// Call the `listAllProjectsRef()` function to get a reference to the query.
const ref = listAllProjectsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllProjectsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.projects);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.projects);
});
```

## GetUserPosts
You can execute the `GetUserPosts` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUserPosts(vars: GetUserPostsVariables): QueryPromise<GetUserPostsData, GetUserPostsVariables>;

interface GetUserPostsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserPostsVariables): QueryRef<GetUserPostsData, GetUserPostsVariables>;
}
export const getUserPostsRef: GetUserPostsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserPosts(dc: DataConnect, vars: GetUserPostsVariables): QueryPromise<GetUserPostsData, GetUserPostsVariables>;

interface GetUserPostsRef {
  ...
  (dc: DataConnect, vars: GetUserPostsVariables): QueryRef<GetUserPostsData, GetUserPostsVariables>;
}
export const getUserPostsRef: GetUserPostsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserPostsRef:
```typescript
const name = getUserPostsRef.operationName;
console.log(name);
```

### Variables
The `GetUserPosts` query requires an argument of type `GetUserPostsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserPostsVariables {
  userId: UUIDString;
}
```
### Return Type
Recall that executing the `GetUserPosts` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserPostsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetUserPosts`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserPosts, GetUserPostsVariables } from '@dataconnect/generated';

// The `GetUserPosts` query requires an argument of type `GetUserPostsVariables`:
const getUserPostsVars: GetUserPostsVariables = {
  userId: ..., 
};

// Call the `getUserPosts()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserPosts(getUserPostsVars);
// Variables can be defined inline as well.
const { data } = await getUserPosts({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserPosts(dataConnect, getUserPostsVars);

console.log(data.posts);

// Or, you can use the `Promise` API.
getUserPosts(getUserPostsVars).then((response) => {
  const data = response.data;
  console.log(data.posts);
});
```

### Using `GetUserPosts`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserPostsRef, GetUserPostsVariables } from '@dataconnect/generated';

// The `GetUserPosts` query requires an argument of type `GetUserPostsVariables`:
const getUserPostsVars: GetUserPostsVariables = {
  userId: ..., 
};

// Call the `getUserPostsRef()` function to get a reference to the query.
const ref = getUserPostsRef(getUserPostsVars);
// Variables can be defined inline as well.
const ref = getUserPostsRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserPostsRef(dataConnect, getUserPostsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.posts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.posts);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateNewProject
You can execute the `CreateNewProject` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createNewProject(vars: CreateNewProjectVariables): MutationPromise<CreateNewProjectData, CreateNewProjectVariables>;

interface CreateNewProjectRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewProjectVariables): MutationRef<CreateNewProjectData, CreateNewProjectVariables>;
}
export const createNewProjectRef: CreateNewProjectRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createNewProject(dc: DataConnect, vars: CreateNewProjectVariables): MutationPromise<CreateNewProjectData, CreateNewProjectVariables>;

interface CreateNewProjectRef {
  ...
  (dc: DataConnect, vars: CreateNewProjectVariables): MutationRef<CreateNewProjectData, CreateNewProjectVariables>;
}
export const createNewProjectRef: CreateNewProjectRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createNewProjectRef:
```typescript
const name = createNewProjectRef.operationName;
console.log(name);
```

### Variables
The `CreateNewProject` mutation requires an argument of type `CreateNewProjectVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateNewProjectVariables {
  title: string;
  description: string;
  appStoreLink?: string | null;
  githubLink?: string | null;
  videoLink?: string | null;
  screenshots?: string[] | null;
  tags?: string[] | null;
}
```
### Return Type
Recall that executing the `CreateNewProject` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateNewProjectData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateNewProjectData {
  project_insert: Project_Key;
}
```
### Using `CreateNewProject`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createNewProject, CreateNewProjectVariables } from '@dataconnect/generated';

// The `CreateNewProject` mutation requires an argument of type `CreateNewProjectVariables`:
const createNewProjectVars: CreateNewProjectVariables = {
  title: ..., 
  description: ..., 
  appStoreLink: ..., // optional
  githubLink: ..., // optional
  videoLink: ..., // optional
  screenshots: ..., // optional
  tags: ..., // optional
};

// Call the `createNewProject()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createNewProject(createNewProjectVars);
// Variables can be defined inline as well.
const { data } = await createNewProject({ title: ..., description: ..., appStoreLink: ..., githubLink: ..., videoLink: ..., screenshots: ..., tags: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createNewProject(dataConnect, createNewProjectVars);

console.log(data.project_insert);

// Or, you can use the `Promise` API.
createNewProject(createNewProjectVars).then((response) => {
  const data = response.data;
  console.log(data.project_insert);
});
```

### Using `CreateNewProject`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createNewProjectRef, CreateNewProjectVariables } from '@dataconnect/generated';

// The `CreateNewProject` mutation requires an argument of type `CreateNewProjectVariables`:
const createNewProjectVars: CreateNewProjectVariables = {
  title: ..., 
  description: ..., 
  appStoreLink: ..., // optional
  githubLink: ..., // optional
  videoLink: ..., // optional
  screenshots: ..., // optional
  tags: ..., // optional
};

// Call the `createNewProjectRef()` function to get a reference to the mutation.
const ref = createNewProjectRef(createNewProjectVars);
// Variables can be defined inline as well.
const ref = createNewProjectRef({ title: ..., description: ..., appStoreLink: ..., githubLink: ..., videoLink: ..., screenshots: ..., tags: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createNewProjectRef(dataConnect, createNewProjectVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.project_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.project_insert);
});
```

## AddCommentToProject
You can execute the `AddCommentToProject` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addCommentToProject(vars: AddCommentToProjectVariables): MutationPromise<AddCommentToProjectData, AddCommentToProjectVariables>;

interface AddCommentToProjectRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddCommentToProjectVariables): MutationRef<AddCommentToProjectData, AddCommentToProjectVariables>;
}
export const addCommentToProjectRef: AddCommentToProjectRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addCommentToProject(dc: DataConnect, vars: AddCommentToProjectVariables): MutationPromise<AddCommentToProjectData, AddCommentToProjectVariables>;

interface AddCommentToProjectRef {
  ...
  (dc: DataConnect, vars: AddCommentToProjectVariables): MutationRef<AddCommentToProjectData, AddCommentToProjectVariables>;
}
export const addCommentToProjectRef: AddCommentToProjectRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addCommentToProjectRef:
```typescript
const name = addCommentToProjectRef.operationName;
console.log(name);
```

### Variables
The `AddCommentToProject` mutation requires an argument of type `AddCommentToProjectVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddCommentToProjectVariables {
  projectId: UUIDString;
  content: string;
}
```
### Return Type
Recall that executing the `AddCommentToProject` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddCommentToProjectData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddCommentToProjectData {
  comment_insert: Comment_Key;
}
```
### Using `AddCommentToProject`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addCommentToProject, AddCommentToProjectVariables } from '@dataconnect/generated';

// The `AddCommentToProject` mutation requires an argument of type `AddCommentToProjectVariables`:
const addCommentToProjectVars: AddCommentToProjectVariables = {
  projectId: ..., 
  content: ..., 
};

// Call the `addCommentToProject()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addCommentToProject(addCommentToProjectVars);
// Variables can be defined inline as well.
const { data } = await addCommentToProject({ projectId: ..., content: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addCommentToProject(dataConnect, addCommentToProjectVars);

console.log(data.comment_insert);

// Or, you can use the `Promise` API.
addCommentToProject(addCommentToProjectVars).then((response) => {
  const data = response.data;
  console.log(data.comment_insert);
});
```

### Using `AddCommentToProject`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addCommentToProjectRef, AddCommentToProjectVariables } from '@dataconnect/generated';

// The `AddCommentToProject` mutation requires an argument of type `AddCommentToProjectVariables`:
const addCommentToProjectVars: AddCommentToProjectVariables = {
  projectId: ..., 
  content: ..., 
};

// Call the `addCommentToProjectRef()` function to get a reference to the mutation.
const ref = addCommentToProjectRef(addCommentToProjectVars);
// Variables can be defined inline as well.
const ref = addCommentToProjectRef({ projectId: ..., content: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addCommentToProjectRef(dataConnect, addCommentToProjectVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.comment_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.comment_insert);
});
```

