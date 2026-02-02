export interface IFx {
    /*
     * the name of the function
     * can be duplicated if the method or route is different
     * the name is used to identify the file and the function exported from the file
     */
    name: string;

    /*
     * server route of the function
     * it is appened to the base route of the group
     * default: "/name"
     */
    route: string;

    /*
     * method of the route
     * default: "get"
     */
    method: "get" | "post";

    /*
     * sandboxing level of the function
     * 0: directly loaded by require
     * 1: loaded using service workers
     * 2: loaded using child_process
     * 3: (not planned) loaded using containers
     * default: 0
     */
    sandbox: 0 | 1 | 2 | 3;
}
