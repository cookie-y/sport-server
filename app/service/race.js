'use strict';

const Service = require('egg').Service;
const { Op } = require('sequelize');

class RaceService extends Service {
  // 新增比赛
  async addRace() {
    const { ctx } = this;
    const race = ctx.request.body;
    const files = await ctx.service.storage.uploadFile('race');
    race.rule = files.rule.join(',');
    race.racePoster = files.racePoster.join(',');
    race.venueImgs = files.venueImgs.join(',');
    const result = await ctx.model.Race.add(race);
    return result;
  }

  // 获取比赛列表
  async getRaceList() {
    const { ctx } = this;
    const { keyword, state, page = 1, size = 10 } = ctx.query;
    const filter = {
      where: {
        state,
      },
      order: [
        [ 'pv', 'DESC' ],
      ],
      limit: +size,
      offset: +size * (+page - 1),
    };
    if (keyword) {
      filter.where.raceName = { [Op.substring]: keyword };
    }
    const result = await ctx.model.Race.getListPaginated(filter);
    return result;
  }

  // 获取我举办的比赛列表
  async getMyHostList(accountId, page, size) {
    const { ctx } = this;
    const filter = {
      include: ctx.model.Account,
      where: {
        organizer: accountId,
      },
      order: [
        [ 'applyStart', 'DESC' ],
      ],
      limit: +size,
      offset: +size * (+page - 1),
    };
    const result = await ctx.model.Race.getListPaginated(filter);
    return result;
  }

  // 获取我参加的比赛列表
  async getMyAttendList(accountId, page, size) {
    const { ctx } = this;
    const filter = {
      include: {
        model: ctx.model.ParticipateRecord,
        as: 'participates',
        where: {
          accountId,
        },
      },
      order: [
        [ 'applyStart', 'DESC' ],
      ],
      limit: +size,
      offset: +size * (+page - 1),
    };
    const result = await ctx.model.Race.getListPaginated(filter);
    return result;
  }

  // 获取比赛详情
  async getDetail() {
    const { ctx } = this;
    const filter = {
      attributes: { exclude: [ 'organizer' ] },
      where: ctx.query,
      include: [
        {
          model: ctx.model.ParticipateRecord,
          as: 'participates',
        },
        {
          model: ctx.model.Account,
          as: 'organize',
        },
      ],
    };
    const result = await ctx.model.Race.getRace(filter);
    return result;
  }

  // 获取热搜列表
  async getHotList() {
    const { ctx } = this;
    const filter = {
      where: {
        state: {
          [Op.ne]: 0,
        },
      },
      order: [
        [ 'pv', 'DESC' ],
      ],
      limit: 10,
    };
    const result = await ctx.model.Race.getList(filter);
    return result;
  }

  // 更新比赛信息
  update() {}

}

module.exports = RaceService;
