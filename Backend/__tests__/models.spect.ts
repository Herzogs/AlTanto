import Category from '../src/models/Category';
import Location from '../src/models/Location';
import Report from "../src/models/Report";
import Zone from "../src/models/Zone";

describe('Database Tables', () => {
    it('should create Category table', async () => {
        await Category.sync();
        const tableExists = await Category.describe();
        expect(tableExists).toBeDefined();
    });

    it('should create Location table', async () => {
        await Location.sync();
        const tableExists = await Location.describe();
        expect(tableExists).toBeDefined();
    });
    it('should create Location table', async ()=>{
        await Report.sync();
        const tableExists = await Location.describe();
        expect(tableExists).toBeDefined()
    });
    it('should create Zone table', async ()=>{
        await Zone.sync();
        const tableExists = await Zone.describe();
        expect(tableExists).toBeDefined()
    })

});