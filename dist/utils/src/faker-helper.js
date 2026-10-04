import { faker } from '@faker-js/faker';
export const DEF_FAKER_MAX_RETRIES = 1500;
export const DEF_FAKER_MAX_TIME = 250;
export class FakerHelper {
    constructor() {
        this.generatedEmails = new Set();
        this.randomDecimal = (min, max, precision) => {
            return faker.number
                .float({ multipleOf: precision, min: min, max: max })
                .toString();
        };
        this.randomBirthDate = (start = 18, end = 100) => {
            const birthDate = faker.date.past({ years: end - start });
            birthDate.setUTCFullYear(birthDate.getUTCFullYear() - start);
            const yyyy = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(birthDate);
            const mm = new Intl.DateTimeFormat('en', { month: 'numeric' }).format(birthDate);
            const dd = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(birthDate);
            return `${yyyy}-${mm}-${dd}`;
        };
        this.randomLockDate = () => {
            const random = faker.number.int(2);
            if (random === 0) {
                return faker.date.past({ years: 3 });
            }
            else if (random === 1) {
                return faker.date.future({ years: 1 });
            }
            else {
                return undefined;
            }
        };
    }
    createPerson() {
        const gender = faker.number.int(1) === 0 ? 'male' : 'female';
        const firstName = faker.person.firstName(gender);
        const lastName = faker.person.lastName(gender);
        return {
            gender,
            firstName,
            lastName,
            email: this.generateNewEmail(firstName, lastName, 'gmail.test'),
        };
    }
    generateNewEmail(firstName, lastName, provider) {
        const startTime = Date.now();
        for (let attempt = 0; attempt < DEF_FAKER_MAX_RETRIES; attempt++) {
            const email = faker.internet.email({ firstName, lastName, provider });
            if (!this.generatedEmails.has(email)) {
                this.generatedEmails.add(email);
                return email;
            }
            if (Date.now() - startTime > DEF_FAKER_MAX_TIME) {
                break;
            }
        }
        const fallbackEmail = faker.internet.email({
            firstName,
            lastName,
            provider,
        });
        this.generatedEmails.add(fallbackEmail);
        return fallbackEmail;
    }
    randomFromEnum(inputEnum) {
        const randInt = faker.number.int(Object.keys(inputEnum).length - 1);
        return inputEnum[Object.keys(inputEnum)[randInt]];
    }
}
//# sourceMappingURL=faker-helper.js.map