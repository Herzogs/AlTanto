import { createContainer, asClass, asValue} from "awilix";
import Category from "./repository/entities/Category";
import Group from "./repository/entities/Group";
import { GroupUser} from "./repository/entities/GroupUser";
import {Location} from "./repository/entities/Location";
import Report from "./repository/entities/Report";
import User from "./repository/entities/User";
import Zone from "./repository/entities/Zone";
import Road from "./repository/entities/Road";
import CategoryRepository from "./repository/category.repository";
import CategoryService from "./services/category.service";
import GroupRepository from './repository/group.repository'
import GroupUserRepository from './repository/groupUser.repository'
import GroupService from './services/group.service'
import GroupUserService from './services/groupUser.service'
import ReportRepository from "./repository/reports.repository";
import ReportService from "./services/report.service";
import ImageAnalysis from "./services/imageAnalysis.service";
import TranslateText from "./services/translate.service";
import UserRepository from "./repository/user.repository";
import UserService from "./services/user.service";
import CognitoService from "./services/cognito.service";
import RoadRepository from "./repository/road.repository";
import RoadService from "./services/road.service";
import ZoneRepository from "./repository/zone.repository";
import ZoneService from "./services/zone.service";

const container = createContainer();

container.register({
    User: asValue(User),
    Report: asValue(Report),
    Zone: asValue(Zone),
    Location: asValue(Location),
    Group: asValue(Group),
    Category: asValue(Category),
    GroupUser: asValue(GroupUser),
    Road: asValue(Road),
    groupService: asClass(GroupService).scoped(),
    groupUserService: asClass(GroupUserService).scoped(),
    groupRepository: asClass(GroupRepository).scoped(),
    groupUserRepository: asClass(GroupUserRepository).scoped(),
    categoryRepository: asClass(CategoryRepository).scoped(),
    categoryService: asClass(CategoryService).scoped(),
    reportRepository: asClass(ReportRepository).scoped(),
    reportService: asClass(ReportService).scoped(),
    cognitoService: asClass(CognitoService).scoped(),
    userRepository: asClass(UserRepository).scoped(),
    userService: asClass(UserService).scoped(),
    roadRepository: asClass(RoadRepository).scoped(),
    roadService: asClass(RoadService).scoped(),
    zoneRepository: asClass(ZoneRepository).scoped(),
    zoneService: asClass(ZoneService).scoped(),
    imageAnalysis: asClass(ImageAnalysis).scoped(),
    translateText: asClass(TranslateText).scoped()
});

export default container;