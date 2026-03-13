import {
  RECRUITMENT_TYPE_OPTIONS,
  ROLE_OPTIONS,
  SORT_OPTIONS,
} from '../constants/filter-options';

export type SortValue = (typeof SORT_OPTIONS)[number]['value'];
export type RecruitmentTypeValue =
  (typeof RECRUITMENT_TYPE_OPTIONS)[number]['value'];
export type RoleValue = (typeof ROLE_OPTIONS)[number]['value'];
