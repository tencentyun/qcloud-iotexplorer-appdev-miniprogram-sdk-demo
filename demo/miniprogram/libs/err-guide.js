const navigateToGuide = (guideId, error) => {
  wx.navigateTo({
    url: `/pages/guide/err-guide/err-guide?id=${encodeURIComponent(guideId)}`,
    success: (res) => {
      if (error) {
        res.eventChannel.emit('errorPassthrough', { error });
      }
    },
  });
};

const knowledges = [
  {
    test: (err) => err && typeof err === 'object' && err.code === 'UnauthorizedOperation.APPNoPermissionToStudioProduct',
    showGuide: (err) => {
      navigateToGuide('AppPermissionToProduct', err);
    },
  },
];

const hasGuide = (err) => !!knowledges.find(item => item.test(err));

const showGuide = (err) => {
  const item = knowledges.find(item => item.test(err));
  if (item) {
    item.showGuide(err);
  }
};

module.exports = {
  showGuide,
  hasGuide
};
