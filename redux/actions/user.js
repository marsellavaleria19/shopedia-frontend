import http from "../../helper/http";

export const getProfile = async (dispatch) => {
  dispatch({
    type: 'TOGGLE_LOADING'  
  })
  const token = window.localStorage.getItem('token')
  const { data } = await http(token).get('/users/profile')
  dispatch({
    type: 'GET_PROFILE',
    payload: data.results
  })
  dispatch({
    type: 'TOGGLE_LOADING'
  })
}

export const editProfile = (name, gender, images) => {
  console.log(gender)
  return async (dispatch) => {
    try {
      dispatch({
        type: 'TOGGLE_LOADING'
      })
      const token = window.localStorage.getItem('token')
      const param = new FormData()

      // param.append('email', email)
      param.append('gender', gender)
      param.append('name', name)
      // param.append('description', description)
      param.append('image', images)
      const { data } = await http(token).patch('/users/profile', param)
      dispatch({
        type: 'EDIT_PROFILE',
        payload: data
      })
      dispatch({
        type: 'TOGGLE_LOADING'
      })
    } catch (err) {
      dispatch({
        type: 'USER_ERROR',
        payload: err.response
      })
      dispatch({
        type: 'TOGGLE_LOADING'
      })
    }
  }
}

