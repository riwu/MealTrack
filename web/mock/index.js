import api from './api';
import chart from './chart';
import geographic from './geographic';
import notices from './notices';
import profile from './profile';
import rule from './rule';
import user from './user';

export default {
  ...api,
  ...chart,
  ...geographic,
  ...notices,
  ...profile,
  ...rule,
  ...user,
};
