import { Request, Response, NextFunction } from 'express';

export const showRoutesInfo = (req: Request, res: Response, _next: NextFunction) => {
  const routesInfo = `
  <h2>Hotel Miranda endpoints, by Pablo Avilés</h2>
  <div>
    <p><strong>Bookings</strong> routes:</p>
    <ul>
      <li>/bookings GET</li>
      <li>/bookings POST</li>
      <li>/bookings/:bookingId GET</li>
      <li>/bookings/:bookingId PATCH</li>
      <li>/bookings/:bookingId DELETE</li>
    </ul>
  </div>
  <div>
    <p><strong>Contacts</strong> routes:</p>
    <ul>
      <li>/contacts GET</li>
      <li>/contacts POST</li>
      <li>/contacts/:contactId GET</li>
      <li>/contacts/:contactId PATCH</li>
      <li>/contacts/:contactId DELETE</li>
    </ul>
  </div>
  <div>
    <p><strong>Rooms</strong> routes:</p>
    <ul>
      <li>/rooms GET</li>
      <li>/rooms POST</li>
      <li>/rooms/:roomId GET</li>
      <li>/rooms/:roomId PATCH</li>
      <li>/rooms/:roomId DELETE</li>
    </ul>
  </div>
  <div>
    <p><strong>Users</strong> routes:</p>
    <ul>
      <li>/users GET</li>
      <li>/users POST</li>
      <li>/users/:userId GET</li>
      <li>/users/:userId PATCH</li>
      <li>/users/:userId DELETE</li>
    </ul>
  </div>
  `;

  res.status(200).send(routesInfo);
};
