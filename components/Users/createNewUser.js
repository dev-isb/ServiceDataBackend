const service = require("./services");

const name = 'danish';
const email = 'danish@123';
const password = 'danishdanis';




const main = async () => {


    const saveData = await service.createUser({ name, email, password });
    console.log("saveData : ", saveData);
}

main()