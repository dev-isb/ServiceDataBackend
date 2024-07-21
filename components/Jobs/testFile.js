const service = require("./services");
const main = async () => {
    // console.log("calling core show channels ")
    // const response = await service.getCoreShowChannels()
    // console.log("response result : ", JSON.stringify(response));

    // const { actionId } = response;

    const getByActionId = await service.getMembers();
    console.log("getByActionId : ", JSON.stringify(getByActionId));

}

main()