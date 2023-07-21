import {
  createVideoAlertColumns,
  csvAlertColumns,
  updateRoleAlertColumns,
  uploadAlertColumns,
} from "./alertConfig";
import endpoints from "./apiendpoint";
import authenticated from "./authenticated";
import configs from "./config";
import {
  addNewVideo,
  editingReviewTasks,
  assignTasks,
  editTranscription,
  editTranslation,
  Workflow,
  workflowInnerList,
} from "./helpOptions";
import { translate } from "./localisation";
import {
  assameseTagsSuggestionData,
  bengaliTagsSuggestionData,
  bodoTagsSuggestionData,
  englishTagsSuggestionData,
  hindiTagsSuggestionData,
  kannadaTagsSuggestionData,
  malayalamTagsSuggestionData,
  marathiTagsSuggestionData,
  noiseTags,
  odiaTagsSuggestionData,
  sanskritTagsSuggestionData,
  santaliTagsSuggestionData,
  sindhiTagsSuggestionData,
  tamilTagsSuggestionData,
  teluguTagsSuggestionData,
} from "./noiseTags";
import { profileOptions } from "./profileConfigs";
import {
  buttonConfig,
  speakerFields,
  toolBarActions,
  voiceOptions,
} from "./projectConfigs";
import {
  reportLevels,
  languagelevelStats,
  projectReportLevels,
} from "./reportConfig";
import {
  projectColumns,
  usersColumns,
  adminOrgListColumns,
  adminMemberListColumns,
  videoTaskListColumns,
  videoListColumns,
  taskListColumns,
  taskQueueStatusColumns,
  orgTaskListColumns,
  failInfoColumns,
} from "./tableColumns";
import { taskStatus, taskTypes } from "./taskItems";

export {
  endpoints,
  authenticated,
  configs,
  addNewVideo,
  editingReviewTasks,
  assignTasks,
  editTranscription,
  editTranslation,
  Workflow,
  workflowInnerList,
  translate,
  profileOptions,
  reportLevels,
  languagelevelStats,
  projectReportLevels,
  projectColumns,
  usersColumns,
  adminOrgListColumns,
  adminMemberListColumns,
  videoTaskListColumns,
  videoListColumns,
  taskListColumns,
  taskQueueStatusColumns,
  taskStatus,
  taskTypes,
  voiceOptions,
  speakerFields,
  buttonConfig,
  toolBarActions,
  orgTaskListColumns,
  assameseTagsSuggestionData,
  bengaliTagsSuggestionData,
  bodoTagsSuggestionData,
  englishTagsSuggestionData,
  hindiTagsSuggestionData,
  kannadaTagsSuggestionData,
  malayalamTagsSuggestionData,
  marathiTagsSuggestionData,
  odiaTagsSuggestionData,
  sanskritTagsSuggestionData,
  santaliTagsSuggestionData,
  sindhiTagsSuggestionData,
  tamilTagsSuggestionData,
  teluguTagsSuggestionData,
  noiseTags,
  failInfoColumns,
  createVideoAlertColumns,
  csvAlertColumns,
  uploadAlertColumns,
  updateRoleAlertColumns,
};
