import { randomUUID } from "crypto";

type Appointment = {
  id: string;
  patientName: string;
  treatment: string;
  date: string;
  time: string;
  status: "Pendiente" | "Confirmada" | "Cancelada";
  createdAt: string;
};

const appointments: Appointment[] = [];

export const config = {
  runtime: "nodejs",
};

export default function handler(req: any, res: any) {
  if (req.method === "GET") {
    return res.status(200).json(appointments);
  }

  if (req.method === "POST") {
    const { patientName, treatment, date, time } = req.body || {};

    if (!patientName || !treatment || !date || !time) {
      return res.status(400).json({ error: "Faltan datos obligatorios: patientName, treatment, date, time." });
    }

    const newAppointment: Appointment = {
      id: randomUUID(),
      patientName,
      treatment,
      date,
      time,
      status: "Pendiente",
      createdAt: new Date().toISOString(),
    };

    appointments.push(newAppointment);
    return res.status(201).json(newAppointment);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
