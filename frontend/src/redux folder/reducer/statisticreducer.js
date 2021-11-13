import { STATISTIC_REQUEST_FAIL, STATISTIC_REQUEST_REQUEST, STATISTIC_REQUEST_RESET, STATISTIC_REQUEST_SUCCESS } from "../constants/statisticconstant";

export const DepartmentStatisticReducer = (state = { loading: true, statistic: {}}, action) => {
    switch (action.type) {
      case STATISTIC_REQUEST_REQUEST:
        return { loading: true };
      case STATISTIC_REQUEST_SUCCESS:
        return { loading: false, statistic: action.payload };
      case STATISTIC_REQUEST_FAIL:
        return { loading: false, error: action.payload };
      case STATISTIC_REQUEST_RESET:
        return {};
      default:
        return state;
    }
  };