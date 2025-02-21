"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

// Dummy employee data
const dummyEmployees = [
  {
    udise_code: 307435,
    name_of_sanctioned_posts: "senior assistant",
    emp_name: "Amit Sharma",
    emp_id: 4623,
    date_of_birth: "1985-05-15",
    date_of_first_appointment: "2016-08-20",
    designation_at_first_appointment: "junior senior assistant",
    qualification: "M.Ed",
    subject_in_pg: "Computer Science",
    present_designation: "senior assistant",
    date_of_latest_promotion: "2019-05-17",
    date_of_retirement: "2050-05-15",
    date_from_which_working_in_this_current_office: "2016-08-20",
    last_three_postings: {
      first_posting: {
        school: "Prev School 1",
        start_date: "2016-08-20",
        end_date: "2018-01-02"
      },
      second_posting: {
        school: "Prev School 2",
        start_date: "2018-01-03",
        end_date: "2019-05-18"
      },
      third_posting: {
        school: "Current School",
        start_date: "2019-05-19",
        end_date: "Present"
      }
    },
    current_payscale: "₹676821",
    pay_level: "Level 5",
    gross_salary: "₹949389",
    whether_nps_or_ops: "NPS"
  }
];

export default function EmployeeDetailPage() {
  const router = useRouter();
  const { employeeid } = useParams(); // using useParams from next/navigation
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    if (employeeid) {
      // Find employee by converting employeeid from params to a number
      const emp = dummyEmployees.find(
        (emp) => emp.emp_id === parseInt(employeeid, 10)
      );
      setEmployee(emp);
    }
  }, [employeeid]);

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading employee details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-blue-600 hover:underline mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </button>

        {/* Header */}
        <h1 className="text-3xl font-bold mb-6">{employee.emp_name}</h1>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="mb-2">
              <span className="font-semibold">Employee ID:</span> {employee.emp_id}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Date of Birth:</span> {employee.date_of_birth}
            </p>
            <p className="mb-2">
              <span className="font-semibold">First Appointment:</span> {employee.date_of_first_appointment}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Designation at First Appointment:</span> {employee.designation_at_first_appointment}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Qualification:</span> {employee.qualification}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Subject in PG:</span> {employee.subject_in_pg}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Present Designation:</span> {employee.present_designation}
            </p>
          </div>
          <div>
            <p className="mb-2">
              <span className="font-semibold">Latest Promotion:</span> {employee.date_of_latest_promotion}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Retirement Date:</span> {employee.date_of_retirement}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Working Since (Current Office):</span> {employee.date_from_which_working_in_this_current_office}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Current Payscale:</span> {employee.current_payscale}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Pay Level:</span> {employee.pay_level}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Gross Salary:</span> {employee.gross_salary}
            </p>
            <p className="mb-2">
              <span className="font-semibold">NPS/OPS:</span> {employee.whether_nps_or_ops}
            </p>
          </div>
        </div>

        {/* Last Three Postings */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Last Three Postings</h2>
          <div className="space-y-4">
            {/* First Posting */}
            <div className="p-4 border rounded-md">
              <p className="font-semibold mb-2">First Posting:</p>
              <p>
                <span className="font-semibold">School:</span> {employee.last_three_postings.first_posting.school}
              </p>
              <p>
                <span className="font-semibold">Start Date:</span> {employee.last_three_postings.first_posting.start_date}
              </p>
              <p>
                <span className="font-semibold">End Date:</span> {employee.last_three_postings.first_posting.end_date}
              </p>
            </div>

            {/* Second Posting */}
            <div className="p-4 border rounded-md">
              <p className="font-semibold mb-2">Second Posting:</p>
              <p>
                <span className="font-semibold">School:</span> {employee.last_three_postings.second_posting.school}
              </p>
              <p>
                <span className="font-semibold">Start Date:</span> {employee.last_three_postings.second_posting.start_date}
              </p>
              <p>
                <span className="font-semibold">End Date:</span> {employee.last_three_postings.second_posting.end_date}
              </p>
            </div>

            {/* Third Posting */}
            <div className="p-4 border rounded-md">
              <p className="font-semibold mb-2">Third Posting:</p>
              <p>
                <span className="font-semibold">School:</span> {employee.last_three_postings.third_posting.school}
              </p>
              <p>
                <span className="font-semibold">Start Date:</span> {employee.last_three_postings.third_posting.start_date}
              </p>
              <p>
                <span className="font-semibold">End Date:</span> {employee.last_three_postings.third_posting.end_date}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
