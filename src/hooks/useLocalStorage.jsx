import { useReducer, useEffect } from 'react'

const actionTypes = { error:'ERROR', success:'SUCCESS', save:'SAVE', sincronize:'SINCRONIZE' }

const initialState = ({ initialValue }) => ({
  sincronizedItem: true, error: false, loading: true, item: initialValue,
})

const reducerObject = (state, payload) => ({
  [actionTypes.error]:      { ...state, error: true },
  [actionTypes.success]:    { ...state, error: false, loading: false, sincronizedItem: true, item: payload },
  [actionTypes.save]:       { ...state, item: payload },
  [actionTypes.sincronize]: { ...state, sincronizedItem: false, loading: true },
})

const reducer = (state, action) =>
  reducerObject(state, action.payload)[action.type] || state

export function useLocalStorage(itemName, initialValue) {
  const [state, dispatch] = useReducer(reducer, initialState({ initialValue }))
  const { sincronizedItem, error, loading, item } = state

  const onError      = (err)  => dispatch({ type: actionTypes.error,      payload: err })
  const onSuccess    = (val)  => dispatch({ type: actionTypes.success,    payload: val })
  const onSave       = (val)  => dispatch({ type: actionTypes.save,       payload: val })
  const onSincronize = ()     => dispatch({ type: actionTypes.sincronize })

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const stored = localStorage.getItem(itemName)
        const parsed = stored ? JSON.parse(stored) : initialValue
        if (!stored) localStorage.setItem(itemName, JSON.stringify(initialValue))
        onSuccess(parsed)
      } catch (err) { onError(err) }
    }, 300)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sincronizedItem])

  const saveItem = (newItem) => {
    try {
      localStorage.setItem(itemName, JSON.stringify(newItem))
      onSave(newItem)
    } catch (err) { onError(err) }
  }

  return { item, saveItem, loading, error, sincronizeItem: onSincronize }
}
