import axios from "axios";
import { STATISTIC_REQUEST_FAIL, STATISTIC_REQUEST_REQUEST, STATISTIC_REQUEST_SUCCESS } from "../constants/statisticconstant";

export const DepartmentStatistic = () => async (dispatch, getState) => {
    dispatch({ type: STATISTIC_REQUEST_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    try {
      const { data } = await axios.get('http://localhost:5001/api/statistic', {
        headers: { Authorization: `Bearer ${userInfo.accessToken}` },
      });
      dispatch({ type: STATISTIC_REQUEST_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: STATISTIC_REQUEST_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };