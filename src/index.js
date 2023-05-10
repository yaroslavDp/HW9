import { connect, close } from './connection.js';

const db = await connect();
const usersCollection = db.collection("users");
const studentsCollection = db.collection("students");

const run = async () => {
  try {
    // await getUsersExample();
    // await task1(); // DONE!
    // await task2(); // DONE!
    // await task3(); // DONE!
    // await task4(); // DONE!
    // await task5(); // DONE!
    // await task6(); // DONE!
    // await task7(); // DONE!
    // await task8(); // DONE!
    // await task9(); // DONE!
    // await task10(); // DONE!
    // await task11(); // DONE!
    // await task12(); // DONE!

    await close();
  } catch(err) {
    console.log('Error: ', err)
  }
}
run();

// #### Users
// - Get users example
async function getUsersExample () {
  try {
    const [allUsers, firstUser] = await Promise.all([
      usersCollection.find().toArray(),
      usersCollection.findOne(),
    ])

    console.log('allUsers', allUsers);
    console.log('firstUser', firstUser);
  } catch (err) {
    console.error('getUsersExample', err);
  }
}

// - Get all users, sort them by age (ascending), and return only 5 records with firstName, lastName, and age fields.
async function task1 () {
  try {
    const res = await usersCollection
    .find({}, {projection: {firstName: 1, lastName: 1, age: 1, _id: 0}})
    .sort({age: 1})
    .limit(5)
    .toArray();
    console.log("Result Task1 -> ", res);
  } catch (err) {
    console.error('task1', err)
  }
}

// - Add new field 'skills: []" for all users where age >= 25 && age < 30 or tags includes 'Engineering'
async function task2 () {
  try {
    const res = await usersCollection
    .updateMany({
      $or: [
        { age: { $gte: 25, $lt: 30 } },
        { tags: "Engineering" }
      ]
    },
    {
      $set: { skills: [] }
    })
    console.log("Result Task2 -> ", res);
  } catch (err) {
    console.error('task2', err)
  }
}

// - Update the first document and return the updated document in one operation (add 'js' and 'git' to the 'skills' array)
//   Filter: the document should contain the 'skills' field
async function task3() {
  try {
    const res = await usersCollection
    .findOneAndUpdate({
      skills: {$exists: true}
    },
    { 
      $push: {skills: {$each: ['js', 'git']}}
    },
    {
      returnDocument: 'after'
    })
    console.log("Result Task3 -> ", res.value);
  } catch (err) {
    console.error('task3', err)
  }
}

// - REPLACE the first document where the 'email' field starts with 'john' and the 'address state' is equal to 'CA'
//   Set firstName: "Jason", lastName: "Wood", tags: ['a', 'b', 'c'], department: 'Support'
async function task4 () {
  try {
    const res = await usersCollection
    .replaceOne({
      $and: [
        {email: {$regex: "^john"}},
        {"address.state": "CA"}
      ]
    },
    {
      firstName: "Jason",
      lastName: "Wood",
      email: "john.doe@example.com",
      age: 25,
      address: {
        street: "123 Main St",
        city: "San Francisco",
        state: "CA",
        zip: "94105",
        country: "USA"
      },
      department: "Support",
      createdAt: "2023-04-06T15:00:00.000Z",
      tags: ['a','b','c'],
      skills: ['js', 'git']
    })
    console.log("Result Task4 -> ", res)
  } catch (err) {
    console.log('task4', err);
  }
}

// - Pull tag 'c' from the first document where firstName: "Jason", lastName: "Wood"
async function task5 () {
  try {
    const res = await usersCollection
    .findOneAndUpdate({
      firstName: "Jason",
      lastName: "Wood"
    },
    {
      $pull: {
        tags: "c"
      }
    },
    {
      returnDocument: 'after'
    })
    console.log("Result Task5 -> ", res.value);
  } catch (err) {
    console.log('task5', err);
  }
}

// - Push tag 'b' to the first document where firstName: "Jason", lastName: "Wood"
//   ONLY if the 'b' value does not exist in the 'tags'
async function task6 () {
  try {
    const res = await usersCollection
    .findOneAndUpdate({
      firstName: "Jason",
      lastName: "Wood",
      tags: {$nin: ["b"]}
    },
    {
      $push: {
        tags: "b"
      }
    },
    {
      returnDocument: 'after'
    })
    console.log("Result Task6 -> ", res.value);
  } catch (err) {
    console.log('task6', err);
  }
}

// - Delete all users by department (Support)
async function task7 () {
  try {
    const res = await usersCollection
    .deleteMany({
      department: "Support"
    })
    console.log("Result Task7 -> ", res)
  } catch (err) {
    console.log('task7', err);
  }
}

// #### Articles
// - Create new collection 'articles'. Using bulk write:
//   Create one article per each type (a, b, c)
//   Find articles with type a, and update tag list with next value ['tag1-a', 'tag2-a', 'tag3']
//   Add tags ['tag2', 'tag3', 'super'] to articles except articles with type 'a'
//   Pull ['tag2', 'tag1-a'] from all articles
async function task8 () {
  try {
    await db.createCollection("articles");
    const articlesCollection = db.collection("articles");
    const res = await articlesCollection
    .bulkWrite([
      {insertOne: {document: {name:  'Mongodb - introduction', description: 'Mongodb - text', type: 'a', tags: []}}},
      {insertOne: {document: {name:  'Mongodb - deep dive', description: 'Mongodb - advanced topics', type: 'b', tags: []}}},
      {insertOne: {document: {name:  'Mongodb - best practices', description: 'Mongodb - optimization techniques', type: 'c', tags: []}}},
      {updateMany: {filter: {type: 'a'}, update: {$push: {tags: {$each: ['tag1-a', 'tag2-a', 'tag3']}}}}},
      {updateMany: {filter: {type: {$ne: 'a'}}, update: {$push: {tags: {$each: ['tag2', 'tag3', 'super']}}}}},
      {updateMany: {filter: {}, update: {$pull: {tags: {$in: ['tag2', 'tag1-a']}}}}}
    ])
    console.log("Result Task8 -> ", res)
  } catch (err) {
    console.error('task8', err);
  }
}

// - Find all articles that contains tags 'super' or 'tag2-a'
async function task9 () {
  try {
    const articlesCollection = db.collection("articles");
    const res = await articlesCollection
    .find({tags: {$in: ['super', 'tag2-a']}})
    .toArray()
    console.log("Result Task9 -> ", res)
  } catch (err) {
    console.log('task9', err);
  }
}

// #### Students Statistic (Aggregations)
// - Find the student who have the worst score for homework, the result should be [ { name: <name>, worst_homework_score: <score> } ]
async function task10 () {
  try {
    const res = await studentsCollection
    .aggregate([
      { $unwind: "$scores" },
      { $match: {"scores.type": "homework"} },
      { $sort: {"scores.score": 1} },
      { $limit: 1},
      { $project: { _id: 0, name: "$name", worst_homework_score: "$scores.score" } }
    ]).toArray()
    console.log("Result Task10 -> ", res)
  } catch (err) {
    console.log('task10', err);
  } 
}

// - Calculate the average score for homework for all students, the result should be [ { avg_score: <number> } ]
async function task11 () {
  try {
    const res = await studentsCollection
    .aggregate([
      { $unwind: "$scores" },
      { $match: {"scores.type": "homework"} },
      { $group: {_id: null, avg_score: {$avg: "$scores.score"}}},
      { $project: { _id: 0,  avg_score: 1} }
    ]).toArray()
    console.log("Result Task11 -> ", res)
  } catch (err) {
    console.log('task11', err);
  } 
}

// - Calculate the average score by all types (homework, exam, quiz) for each student, sort from the largest to the smallest value
async function task12 () {
  try {
    const res = await studentsCollection
    .aggregate([
     { $unwind: "$scores"},
     { $group: {_id: "$name", avg_score: {$avg: "$scores.score"}}},
     { $sort: {avg_score: -1}},
     { $project: {_id: 0, name: "$_id", avg_score: 1}}
    ]).toArray()
    console.log("Result Task12 -> ", res)
  } catch (err) {
    console.log('task12', err);
  } 
}
