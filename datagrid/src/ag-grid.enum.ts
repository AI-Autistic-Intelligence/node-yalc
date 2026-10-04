export enum GeneralFilters {
  NOT = 'not',
  CONTAINS = 'contains',
  NOTCONTAINS = 'notContains',
  EQUALS = 'equals',
  EQUAL = 'equal',
  NOTEQUAL = 'notEqual',
  LIKE = 'like',
  NOTLIKE = 'notLike',
  BETWEEN = 'between',
  NOTBETWEEN = 'notBetween',
  IN = 'in',
  NOTIN = 'notIn',
  STARTSWITH = 'startsWith',
  NOTSTARTSWITH = 'notStartsWith',
  ENDSWITH = 'endsWith',
  NOTENDSWITH = 'notEndsWith',
  LESSTHAN = 'lessThan',
  NOTLESSTHAN = 'notLessThan',
  LESSTHANOREQUAL = 'lessThanOrEqual',
  NOTLESSTHANOREQUAL = 'notLessThanOrEqual',
  GREATERTHAN = 'greaterThan',
  NOTGREATERTHAN = 'notGreaterThan',
  GREATERTHANOREQUAL = 'greaterThanOrEqual',
  NOTGREATERTHANOREQUAL = 'notGreaterThanOrEqual',
  INRANGE = 'inRange',
  INDATE = 'inDate',
  ISNULL = 'isNull',
  NOTISNULL = 'notIsNull',
  VIRTUAL = 'virtual',
}

export enum FilterType {
  TEXT = 'text',
  MULTI = 'multi',
  NUMBER = 'number',
  DATE = 'date',
  SET = 'set',
}

export enum Operators {
  AND = 'AND',
  OR = 'OR',
}

export enum SortDirection {
  DESC = 'DESC',
  ASC = 'ASC',
}

export enum CustomWhereKeys {
  MULTICOLUMNJOINOPTIONS = 'multiColumnJoinOptions',
  MULTICOLUMNJOINOPERATOR = 'multiColumnJoinOperator',
  OPERATOR = 'operator',
}

export enum ExtraArgsStrategy {
  DEFAULT,
  AT_LEAST_ONE,
  ONLY_ONE,
}

export enum RowDefaultValues {
  END_ROW = 100,
  START_ROW = 0,
  MAX_ROW = 200,
}
