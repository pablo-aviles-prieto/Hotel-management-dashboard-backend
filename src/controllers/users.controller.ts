import { Request, Response, NextFunction } from 'express';
import { db } from '../data/database';
import { hash } from 'bcryptjs';
import { OkPacket, RowDataPacket } from 'mysql2';
import { IUsersRow } from '../interfaces';

const { BCRYPT_SALT } = process.env;

export const getUsersList = async (req: Request, res: Response, next: NextFunction) => {
  const query = `SELECT * FROM users`;
  try {
    const [rawUsersList] = await db.query<IUsersRow[]>(query);
    const usersList = rawUsersList.map((user) => {
      const updatedObj = {
        ...user,
        startDate: new Date(user.startDate).toISOString().substring(0, 10),
        job: {
          position: user.jobPosition,
          description: user.jobDescription,
          schedule: user.jobSchedule
        }
      };
      delete updatedObj.password;
      delete updatedObj.jobPosition;
      delete updatedObj.jobDescription;
      delete updatedObj.jobSchedule;
      return updatedObj;
    });
    res.status(200).json({ result: usersList });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const queryPost = `INSERT INTO users SET ?`;
  const queryGet = `SELECT * FROM users WHERE email = ?`;
  const { photo, name, email, password, startDate, job, contact, status } = req.body;
  const salt = BCRYPT_SALT ? Number(BCRYPT_SALT) : 12;
  const hashedPassword = await hash(password, salt);
  const userToInsertOnDB = {
    photo,
    name,
    email,
    password: hashedPassword,
    startDate,
    jobPosition: job.position,
    jobDescription: job?.description,
    jobSchedule: job?.schedule,
    contact,
    status
  };

  try {
    const [userExist] = await db.query<RowDataPacket[]>(queryGet, email);
    if (userExist.length > 0) return res.status(400).json({ result: 'Error creating the user' });
    //TODO Check inputs before saving on DB

    const [resultCreatingUser] = await db.query<OkPacket>(queryPost, userToInsertOnDB);
    const insertedObj = {
      ...req.body,
      id: resultCreatingUser.insertId
    };
    delete insertedObj.password;
    res.status(201).json({ result: insertedObj });
  } catch (error) {
    next(error);
  }
};

export const getSingleUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const query = `SELECT * FROM users WHERE id = ?`;
  try {
    const [getUser] = await db.query<IUsersRow[]>(query, parseInt(userId));
    if (getUser.length === 0) return res.status(400).json({ result: 'Error fetching the user' });

    const parsedUser = {
      ...getUser[0],
      job: {
        position: getUser[0].jobPosition,
        description: getUser[0].jobDescription,
        schedule: getUser[0].jobSchedule
      },
      startDate: new Date(getUser[0].startDate).toISOString().substring(0, 10)
    };
    delete parsedUser.password;
    delete parsedUser.jobPosition;
    delete parsedUser.jobDescription;
    delete parsedUser.jobSchedule;

    res.status(200).json({ result: parsedUser });
  } catch (error) {
    next(error);
  }
};

export const editUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const queryGetUser = `SELECT * FROM users WHERE id = ?`;
  const queryEdit = `UPDATE users SET ? WHERE id = ?`;
  const { photo, name, email, password, startDate, job, contact, status } = req.body;

  try {
    const [getUser] = await db.query<RowDataPacket[]>(queryGetUser, parseInt(userId));
    if (getUser.length === 0) return res.status(400).json({ result: 'Error editing the user' });

    const salt = BCRYPT_SALT ? Number(BCRYPT_SALT) : 12;
    const userToUpdateOnDB = {
      photo: photo ? photo : getUser[0].photo,
      name: name ? name : getUser[0].name,
      email: email ? email : getUser[0].email,
      password: password ? await hash(password, salt) : getUser[0].password,
      startDate: startDate ? startDate : getUser[0].startDate,
      jobPosition: job.position ? job.position : getUser[0].position,
      jobDescription: job.description ? job.description : getUser[0].jobDescription,
      jobSchedule: job.schedule ? job.schedule : getUser[0].jobSchedule,
      contact: contact ? contact : getUser[0].contact,
      status: status ? status : getUser[0].status
    };

    //TODO Check inputs before saving on DB
    await db.query<OkPacket>(queryEdit, [userToUpdateOnDB, parseInt(userId)]);
    res.status(200).json({ result: 'User updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const query = `DELETE FROM users WHERE id = ?`;
  try {
    const [result] = await db.query<OkPacket>(query, parseInt(userId));
    if (result.affectedRows === 0) {
      return res.status(404).json({ result: 'Error deleting the selected user' });
    }

    res.status(200).json({ result: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};
