import { faker } from '@faker-js/faker';
import { db } from '../database';

const insertContactData = async () => {
  const randomDate = faker.date.between('2022-01-01', '2022-12-12').toISOString().substring(0, 10);
  const fakeMessageSubject = [
    'Best memories',
    'Unhappy stay',
    'Best place',
    'A bit weird',
    'Amazing views',
    null
  ];
  const randomNumberForMessageSubject = faker.datatype.number({
    min: 0,
    max: fakeMessageSubject.length - 1
  });
  const fakeMessageBody = [
    'It was a good place to crash out',
    'Im surprised with all the surroundings',
    'I could say a few things to improve, but overall was a good place to chill out',
    `Couldnt say anything bad about it`,
    'Happiest place ever',
    'I would disagree with some previous recommendations',
    'Simple the best hotel ever',
    'The best place Ive ever seen'
  ];
  const randomNumberForMessageBody = faker.datatype.number({
    min: 0,
    max: fakeMessageBody.length - 1
  });
  const randomArchived = faker.datatype.boolean();

  const query = `
    INSERT INTO contacts (date, messageSubject, messageBody, archived)
    VALUES ('${randomDate}', '${fakeMessageSubject[randomNumberForMessageSubject]}', '${
    fakeMessageBody[randomNumberForMessageBody]
  }', '${randomArchived ? 1 : 0}')
  `;

  const [result] = await db.query(query);
  console.log('result', result);
  return;
};

const insertData = (numberOfExecutes: number) => {
  [...Array(numberOfExecutes)].forEach(async () => {
    await insertContactData();
  });
};

void insertData(10);
