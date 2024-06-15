import { createContainer, asClass,asValue, Lifetime } from "awilix";
import GroupService from "../services/group.service";

const container = createContainer();

container.register({
    groupService: asClass(GroupService).singleton(),
});

export default container;