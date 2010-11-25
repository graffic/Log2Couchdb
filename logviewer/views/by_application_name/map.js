function(doc) {
  if (doc.App) {
    emit(doc.App, null);
  }
};
