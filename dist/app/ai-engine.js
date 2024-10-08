var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as fs from "fs";
import * as path from "path";
import { parse } from 'csv-parse';
export default class AIEngine {
    web_spec_creator(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            const csvFilePath = yield path.resolve(`${process.cwd()}/app/csv_files`, filename);
            const headers = ['TC_Reference', 'TC_description', 'Action', 'Test_Data', 'Test_Spec_FileName', 'Tag', 'Parent_Folder_Name', 'Locator_Type', 'Role', 'Element_Locator'];
            const fileContent = yield fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
            yield parse(fileContent, {
                delimiter: ',',
                columns: headers,
            }, (error, result) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    console.error(error);
                }
                console.log("------------------------------");
                console.log("Generating web spec started...");
                yield this.spec_writer(result);
                console.log("Web spec generation completed!");
                console.log("------------------------------");
            }));
        });
    }
    ;
    spec_writer(result) {
        return __awaiter(this, void 0, void 0, function* () {
            let template = yield fs.readFileSync(`${process.cwd()}/app/template/spec_template.txt`, { encoding: 'utf-8' });
            let filePath = '';
            let steps = '';
            let i = 1;
            while (i < result.length) {
                if (result[i].Parent_Folder_Name != '' && result[i].Test_Spec_FileName != '') {
                    if (!fs.existsSync(result[i].Parent_Folder_Name)) {
                        fs.mkdirSync(path.resolve(`${process.cwd()}/tests/${result[i].Parent_Folder_Name}`), { recursive: true });
                    }
                    fs.writeFileSync(path.resolve(`${process.cwd()}/tests/${result[i].Parent_Folder_Name}`, result[i].Test_Spec_FileName), '', {
                        flag: "w"
                    });
                    filePath = `${process.cwd()}/tests/${result[i].Parent_Folder_Name}/${result[i].Test_Spec_FileName}`;
                    yield fs.appendFileSync(filePath, template);
                    yield this.updateContent(filePath, 'TC_NAME', result[i].TC_Reference);
                    yield this.updateContent(filePath, 'TAG', result[i].Tag);
                    while (result[i].TC_description != 'Test case description') {
                        if ((yield result[i].Action) == 'goto') {
                            console.log('Go to step created...');
                            steps = steps + `\nawait page.goto('${result[i].Test_Data}');\n`;
                        }
                        if ((yield result[i].Action) == 'fill') {
                            console.log('Fill step created...');
                            if ((yield result[i].Locator_Type) == 'testId') {
                                steps = steps + `\nawait page.getByTestId('${result[i].Element_Locator}').fill('${result[i].Test_Data}');\n`;
                            }
                            if ((yield result[i].Locator_Type) == 'label') {
                                steps = steps + `\nawait page.getByLabel('${result[i].Element_Locator}').fill('${result[i].Test_Data}');\n`;
                            }
                            if ((yield result[i].Locator_Type) == 'role') {
                                steps = steps + `\nawait page.getByRole('${result[i].Role}', {name : '${result[i].Element_Locator}', exact: true}).fill('${result[i].Test_Data}');\n`;
                            }
                            if ((yield result[i].Locator_Type) == 'locator') {
                                steps = steps + `\nawait page.locator('${result[i].Element_Locator}').fill('${result[i].Test_Data}');\n`;
                            }
                            if ((yield result[i].Locator_Type) == 'text') {
                                steps = steps + `\nawait page.getByText('${result[i].Element_Locator}').fill('${result[i].Test_Data}');\n`;
                            }
                            if ((yield result[i].Locator_Type) == 'altText') {
                                steps = steps + `\nawait page.getByAltText('${result[i].Element_Locator}').fill('${result[i].Test_Data}');\n`;
                            }
                        }
                        if ((yield result[i].Action) == 'click') {
                            console.log('Click step created...');
                            if ((yield result[i].Locator_Type) == 'testId') {
                                steps = steps + `\nawait page.getByTestId('${result[i].Element_Locator}').click();\n`;
                            }
                            if ((yield result[i].Locator_Type) == 'label') {
                                steps = steps + `\nawait page.getByLabel('${result[i].Element_Locator}').click();\n`;
                            }
                            if ((yield result[i].Locator_Type) == 'role') {
                                steps = steps + `\nawait page.getByRole('${result[i].Role}', {name : '${result[i].Element_Locator}', exact: true}).click();\n`;
                            }
                            if ((yield result[i].Locator_Type) == 'locator') {
                                steps = steps + `\nawait page.locator('${result[i].Element_Locator}').click();\n`;
                            }
                            if ((yield result[i].Locator_Type) == 'text') {
                                steps = steps + `\nawait page.getByText('${result[i].Element_Locator}').click();\n`;
                            }
                            if ((yield result[i].Locator_Type) == 'altText') {
                                steps = steps + `\nawait page.getByAltText('${result[i].Element_Locator}').click();\n`;
                            }
                        }
                        if ((yield result[i].Action) == 'verify - visible') {
                            console.log('Verification step created...');
                            if ((yield result[i].Locator_Type) == 'testId') {
                                steps = steps + `\nawait expect(page.getByTestId('${result[i].Element_Locator}')).toBeVisible();\n`;
                            }
                            if ((yield result[i].Locator_Type) == 'label') {
                                steps = steps + `\nawait expect(page.getByLabel('${result[i].Element_Locator}')).toBeVisible();\n`;
                            }
                            if ((yield result[i].Locator_Type) == 'role') {
                                steps = steps + `\nawait expect(page.getByRole('${result[i].Role}', {name : '${result[i].Element_Locator}', exact: true})).toBeVisible();\n`;
                            }
                            if ((yield result[i].Locator_Type) == 'locator') {
                                steps = steps + `\nawait expect(page.locator('${result[i].Element_Locator}')).toBeVisible();\n`;
                            }
                            if ((yield result[i].Locator_Type) == 'text') {
                                steps = steps + `\nawait expect(page.getByText('${result[i].Element_Locator}')).toBeVisible();\n`;
                            }
                            if ((yield result[i].Locator_Type) == 'altText') {
                                steps = steps + `\nawait expect(page.getByAltText('${result[i].Element_Locator}')).toBeVisible();\n`;
                            }
                        }
                        if ((yield result[i].Action) == 'verify - enable') {
                            console.log('Verification step created...');
                            if ((yield result[i].Locator_Type) == 'testId') {
                                steps = steps + `\nawait expect(page.getByTestId('${result[i].Element_Locator}')).toBeEnabled();\n`;
                            }
                            if ((yield result[i].Locator_Type) == 'label') {
                                steps = steps + `\nawait expect(page.getByLabel('${result[i].Element_Locator}')).toBeEnabled();\n`;
                            }
                            if ((yield result[i].Locator_Type) == 'role') {
                                steps = steps + `\nawait expect(page.getByRole('${result[i].Role}', {name : '${result[i].Element_Locator}', exact: true})).toBeEnabled();\n`;
                            }
                            if ((yield result[i].Locator_Type) == 'locator') {
                                steps = steps + `\nawait expect(page.locator('${result[i].Element_Locator}')).toBeEnabled();\n`;
                            }
                            if ((yield result[i].Locator_Type) == 'text') {
                                steps = steps + `\nawait expect(page.getByText('${result[i].Element_Locator}')).toBeEnabled();\n`;
                            }
                            if ((yield result[i].Locator_Type) == 'altText') {
                                steps = steps + `\nawait expect(page.getByAltText('${result[i].Element_Locator}')).toBeEnabled();\n`;
                            }
                        }
                        if ((yield result[i].Action) == 'verify - url') {
                            console.log('Verification step created...');
                            let escaped_string = result[i].Test_Data.replace(/\//g, '\\/');
                            steps = steps + `\nawait expect(page).toHaveURL(/${escaped_string}/);\n`;
                        }
                        if ((yield result[i].Action) == 'verify - value') {
                            console.log('Verification step created...');
                            steps = steps + `\nawait expect(page.locator('${result[i].Element_Locator}')).toHaveValue('${result[i].Test_Data}');\n`;
                        }
                        if ((yield result[i].Action) == 'wait') {
                            console.log('Wait step created...');
                            steps = steps + `\nawait page.waitForTimeout(${result[i].Test_Data});\n`;
                        }
                        i++;
                        try {
                            result[i].TC_description;
                        }
                        catch (error) {
                            break;
                        }
                    }
                }
                yield this.updateContent(filePath, 'STEPS', steps);
                i++;
                steps = '';
            }
        });
    }
    api_spec_creator(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            const csvFilePath = yield path.resolve(`${process.cwd()}/app/csv_files`, filename);
            const headers = ['TC_Reference', 'Request_Type', 'API_URL', 'Response_Code', 'Headers', 'Authetication_Bearer_Token', 'Parameter', 'Request_Body', 'Response_Body', 'Test_Spec_FileName', 'Parent_Folder_Name', 'Tag'];
            const fileContent = yield fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
            yield parse(fileContent, {
                delimiter: ',',
                columns: headers,
            }, (error, result) => {
                if (error) {
                    console.error(error);
                }
                this.api_spec_writer(result);
            });
        });
    }
    api_spec_writer(result) {
        return __awaiter(this, void 0, void 0, function* () {
            let template = yield fs.readFileSync(`${process.cwd()}/app/template/api_spec_template.txt`, { encoding: 'utf-8' });
            for (let i = 1; i < result.length; i++) {
                let filePath = `${process.cwd()}/tests/${result[i].Parent_Folder_Name}/${result[i].Test_Spec_FileName}`;
                console.log("------------------------------");
                console.log("Generating api spec started...");
                console.log(`Writing ${result[i].Request_Type} request test...`);
                if (!fs.existsSync(result[i].Parent_Folder_Name)) {
                    fs.mkdirSync(path.resolve(`${process.cwd()}/tests/${result[i].Parent_Folder_Name}`), { recursive: true });
                }
                fs.writeFileSync(path.resolve(`${process.cwd()}/tests/${result[i].Parent_Folder_Name}`, result[i].Test_Spec_FileName), '', {
                    flag: "w"
                });
                fs.appendFileSync(filePath, template);
                let requestBody = "";
                let parameter = "";
                let responseBody = "";
                let header = "";
                let api_url = result[i].API_URL;
                if ((yield result[i].Request_Body) !== "") {
                    console.log('Creating request body...');
                    requestBody = `data: ${result[i].Request_Body},`;
                }
                if ((yield result[i].Response_Body) !== "") {
                    console.log('Creating response body assertion...');
                    responseBody = `
        apiResponse.body().then(body => {
            let expected = '${result[i].Response_Body.replace(/(\r\n|\n|\r)/gm, "")}';
            expect(body.toString().replace(/ +/g, "")).toEqual(expected.replace(/ +/g, ""));
        });`;
                }
                if ((yield result[i].Parameter) !== "") {
                    console.log('Creating parameter...');
                    api_url = api_url.replace("{", "${");
                    parameter = `let ${result[i].Parameter};`;
                }
                if ((yield result[i].Headers) !== "") {
                    console.log('Creating Headers...');
                    header = `headers: ${result[i].Headers},`;
                }
                yield this.updateContent(filePath, 'TC_NAME', result[i].TC_Reference);
                yield this.updateContent(filePath, 'TAG', result[i].Tag);
                yield this.updateContent(filePath, 'API_URL', api_url);
                yield this.updateContent(filePath, 'REQUEST_TYPE', result[i].Request_Type);
                yield this.updateContent(filePath, 'HEADERS', header);
                yield this.updateContent(filePath, 'DATA', requestBody);
                yield this.updateContent(filePath, 'PARAMETER', parameter);
                yield this.updateContent(filePath, 'RESPONSE_BODY', responseBody);
                console.log("API spec generation completed!");
                console.log("------------------------------");
            }
        });
    }
    updateContent(readFilePath, contentToReplace, newContent) {
        return __awaiter(this, void 0, void 0, function* () {
            let content = yield fs.promises.readFile(readFilePath, 'utf-8');
            let updatedContent = yield content.replace(new RegExp(contentToReplace, 'g'), newContent);
            yield fs.promises.writeFile(readFilePath, updatedContent, 'utf-8');
        });
    }
}
