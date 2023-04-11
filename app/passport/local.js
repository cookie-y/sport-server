'use strict';


module.exports = async (ctx, account) => {
  try {
    await ctx.service.auth.validatePassword(account);
    const token = await ctx.signToken(account, false);
    ctx.body = token;

    return token;
  } catch (err) {
    console.log(err);
  }
};