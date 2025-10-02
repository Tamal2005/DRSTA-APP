import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("mappage","routes/MapPage.tsx"),
    route("help","routes/Help.tsx"),

] satisfies RouteConfig;
