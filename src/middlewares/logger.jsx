export const logger = (store) => (next) => (action) => {
  if (import.meta.env.DEV) {
    console.log('[Redux]', action.type, action.payload ?? '')
  }
  return next(action)
}
