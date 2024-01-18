import Pool from '../../db/db.js';
import { uploadFiles } from '../../middlewares/upload.js';

export const saveMessages = async (req, res) => {
  const { receiver, sender, message, type } = req.body;
  try {
    const [responseMessages] = await Pool.query(
      'INSERT INTO messages (EMAIL_SENDER, EMAIL_RECEIVER, Message, Type, OriginalName,Date) VALUES (?,?,?,?,"",NOW())',
      [sender, receiver, message, type]
    );

    if (responseMessages.affectedRows < 1) {
      return res
        .status(500)
        .json({ status: 'failed', message: 'error saving the messages' });
    }

    return res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.log(error);
  }
};

export const saveFiles = async (req, res) => {
  try {
    uploadFiles(req, res, async () => {
      const { receiver, sender, type } = req.body;
      const file = req.file;

      const [filesSaved] = await Pool.query(
        'INSERT INTO messages (EMAIL_RECEIVER, EMAIL_SENDER, Message, Type, OriginalName,Date) VALUES(?,?,?,?,?,NOW())',
        [receiver, sender, file.path, type, file.originalname]
      );

      if (filesSaved.affectedRows < 1) {
        return res.status(500).json({ status: 'failed' });
      }

      return res.status(200).json({ status: 'ok', file: file.path });
    });
  } catch (error) {
    console.log(error);
  }
};

export const loadMessages = async (req, res) => {
  const { me, other } = req.body;

  try {
    const [messages] = await Pool.query(
      'SELECT Message, Type, EMAIL_SENDER, EMAIL_RECEIVER, OriginalName FROM messages WHERE (EMAIL_SENDER = ? AND EMAIL_RECEIVER = ?) OR (EMAIL_SENDER = ? AND EMAIL_RECEIVER = ?)',
      [me, other, other, me]
    );

    if (messages.length < 1) return res.status(404).json({ messages: '' });

    return res.status(200).json({ messages });
  } catch (error) {
    console.log(error);
  }
};

export const loadContacts = async (req, res) => {
  const { email } = req.params;

  try {
    const [users] = await Pool.query(
      'SELECT EMAIL_RECEIVER, EMAIL_SENDER, Message, Date FROM messages WHERE EMAIL_RECEIVER = ? OR EMAIL_SENDER = ?',
      [email, email]
    );

    if (users.length < 1)
      return res.status(200).json({
        users: '',
      });

    return res.status(200).json({
      status: 'ok',
      users,
    });
  } catch (error) {
    console.log(error);
  }
};
