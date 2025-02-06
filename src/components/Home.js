import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Home.css';

function App() {
    const [courses, setCourses] = useState([]);
    const [faculty, setFaculty] = useState([]);
    const [totalClassrooms, setTotalClassrooms] = useState(0);
    const [timetable, setTimetable] = useState([]);
    const [isVerified, setIsVerified] = useState(false);
    const [courseInput, setCourseInput] = useState('');
    const [facultyInput, setFacultyInput] = useState('');
    const [availabilityInput, setAvailabilityInput] = useState('');
    const [courseType, setCourseType] = useState('Theory');
    const [isDarkMode, setIsDarkMode] = useState(false); // New state for dark mode

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    const addCourse = () => {
        if (courseInput) {
            setCourses([...courses, { name: courseInput, type: courseType }]);
            setCourseInput('');
            setCourseType('Theory'); // Reset to default
        }
    };

    const addFaculty = () => {
        if (facultyInput && availabilityInput) {
            setFaculty([...faculty, { name: facultyInput, availability: availabilityInput }]);
            setFacultyInput('');
            setAvailabilityInput('');
        }
    };

    const setClassroomCount = () => {
        if (totalClassrooms > 0) {
            setTotalClassrooms(totalClassrooms);
        }
    };

    const verifyDetails = () => {
        if (courses.length === 0 || faculty.length === 0 || totalClassrooms <= 0) {
            alert("Please ensure all details are filled out.");
            return;
        }
        setIsVerified(true);
    };

    const nextScheduledDay = {
        'Monday': 'Thursday',
        'Tuesday': 'Friday',
        'Wednesday': 'Monday',
        'Thursday': 'Tuesday',
        'Friday': 'Wednesday'
    };

    const formatTime = (hour, minute) => {
        const period = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12; // Convert to 12-hour format
        const formattedMinute = minute < 10 ? '0' + minute : minute; // Add leading zero if needed
        return `${formattedHour}:${formattedMinute} ${period}`;
    };

    const generateTimetable = () => {
        const newTimetable = [];
        let startHour = 8; // Start at 8 AM
        let startMinute = 0;

        // Track the last scheduled day for each course
        const lastScheduledDay = {};

        // Create a schedule for each course
        courses.forEach((course, index) => {
            const facultyMember = faculty[index % faculty.length]?.name || 'N/A'; // Assign faculty in a round-robin manner
            const classroomNumber = (index % totalClassrooms) + 1; // Assign classroom based on index

            // Find a suitable day for the course
            for (let dayOffset = 0; dayOffset < daysOfWeek.length; dayOffset++) {
                let dayIndex = (index + dayOffset) % daysOfWeek.length;
                const day = daysOfWeek[dayIndex];

                // Check if the course was scheduled in the last two days
                if (!lastScheduledDay[course.name] || lastScheduledDay[course.name] !== day) {
                    if (course.type === 'Theory') {
                        // Schedule two lectures for theory with a 2-day gap
                        const firstLectureDay = day;
                        const secondLectureDay = nextScheduledDay[firstLectureDay];

                        // Schedule first lecture
                        const endHourFirst = Math.floor((startMinute + 75) / 60) + startHour;
                        const endMinuteFirst = (startMinute + 75) % 60;

                        newTimetable.push({
                            course: course.name,
                            faculty: facultyMember,
                            classroom: `Room ${classroomNumber}`,
                            day: firstLectureDay,
                            startTime: formatTime(startHour, startMinute),
                            endTime: formatTime(endHourFirst, endMinuteFirst),
                        });

                        // Update start time for the next class
                        startMinute += 75 + 15; // Add 15 minutes break
                        if (startMinute >= 60) {
                            startHour += Math.floor(startMinute / 60);
                            startMinute = startMinute % 60;
                        }

                        // Schedule second lecture
                        const endHourSecond = Math.floor((startMinute + 75) / 60) + startHour;
                        const endMinuteSecond = (startMinute + 75) % 60;

                        newTimetable.push({
                            course: course.name,
                            faculty: facultyMember,
                            classroom: `Room ${classroomNumber}`,
                            day: secondLectureDay,
                            startTime: formatTime(startHour, startMinute),
                            endTime: formatTime(endHourSecond, endMinuteSecond),
                        });

                        // Update the last scheduled day for this course
                        lastScheduledDay[course.name] = secondLectureDay;

                    } else if (course.type === 'Lab') {
                        // Schedule one lab
                        const endHour = Math.floor((startMinute + 150) / 60) + startHour;
                        const endMinute = (startMinute + 150) % 60;

                        newTimetable.push({
                            course: course.name,
                            faculty: facultyMember,
                            classroom: `Room ${classroomNumber}`,
                            day: day,
                            startTime: formatTime(startHour, startMinute),
                            endTime: formatTime(endHour, endMinute),
                        });

                        // Update start time for the next class
                        startMinute += 150 + 15; // Add 15 minutes break
                        if (startMinute >= 60) {
                            startHour += Math.floor(startMinute / 60);
                            startMinute = startMinute % 60;
                        }
                    }

                    // Stop scheduling if the last lecture starts after 5 PM
                    if (startHour >= 17) {
                        return;
                    }

                    break; // Exit the loop once a suitable day is found
                }
            }
        });

        setTimetable(newTimetable);
    };

    const downloadExcel = () => {
        // Prepare the data for the Excel sheet
        const formattedData = timetable.map(entry => ({
            Course: entry.course,
            Faculty: entry.faculty,
            Classroom: entry.classroom,
            Day: entry.day,
            'Start Time': entry.startTime,
            'End Time': entry.endTime
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Timetable");
        XLSX.writeFile(workbook, "timetable.xlsx");
    };

    const downloadPDF = () => {
        const pdfDoc = new jsPDF();
        pdfDoc.autoTable({
            head: [['Course', 'Faculty', 'Classroom', 'Day', 'Start Time', 'End Time']],
            body: timetable.map(entry => [
                entry.course,
                entry.faculty,
                entry.classroom,
                entry.day,
                entry.startTime,
                entry.endTime
            ]),
        });
        pdfDoc.save("timetable.pdf");
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (

        <div className='home'>
        <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
            <h1>Timetable Generator</h1>
            <button onClick={toggleDarkMode}>
                Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
            </button>

            <div className="form-section">
                <h2>Input Courses</h2>
                <input
                    type="text"
                    value={courseInput}
                    onChange={(e) => setCourseInput(e.target.value)}
                    placeholder="Enter course name"
                />
                <select value={courseType} onChange={(e) => setCourseType(e.target.value)}>
                    <option value="Theory">Theory</option>
                    <option value="Lab">Lab</option>
                </select>
                <button onClick={addCourse}>Add Course</button>
            </div>

            <div className="form-section">
                <h2>Faculty Availability</h2>
                <input
                    type="text"
                    value={facultyInput}
                    onChange={(e) => setFacultyInput(e.target.value)}
                    placeholder="Enter faculty name"
                />
                <input
                    type="text"
                    value={availabilityInput}
                    onChange={(e) => setAvailabilityInput(e.target.value)}
                    placeholder="Enter availability (e.g., Mon 9-11)"
                />
                <button onClick={addFaculty}>Add Faculty</button>
            </div>

            <div className="form-section">
                <h2>Total Classrooms</h2>
                <input
                    type="number"
                    value={totalClassrooms}
                    onChange={(e) => setTotalClassrooms(Number(e.target.value))}
                    placeholder="Enter total number of classrooms"
                />
                <button onClick={setClassroomCount}>Set Classrooms</button>
            </div>

            <button onClick={verifyDetails}>Verify Details</button>

            {isVerified && (
                <div>
                    <h2>Details Verification</h2>
                    <h3>Courses:</h3>
                    <ul>
                        {courses.map((course, index) => (
                            <li key={index}>{course.name} - {course.type}</li>
                        ))}
                    </ul>
                    <h3>Faculty:</h3>
                    <ul>
                        {faculty.map((member, index) => (
                            <li key={index}>{member.name} - {member.availability}</li>
                        ))}
                    </ul>
                    <h3>Total Classrooms:</h3>
                    <p>{totalClassrooms}</p>
                    <button onClick={generateTimetable}>Generate Timetable</button>
                </div>
            )}

            {timetable.length > 0 && (
                <div>
                    <h2>Generated Timetable</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Course</th>
                                <th>Faculty</th>
                                <th>Classroom</th>
                                <th>Day</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {timetable.map((entry, index) => (
                                <tr key={index}>
                                    <td>{entry.course}</td>
                                    <td>{entry.faculty}</td>
                                    <td>{entry.classroom}</td>
                                    <td>{entry.day}</td>
                                    <td>{entry.startTime}</td>
                                    <td>{entry.endTime}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={downloadExcel}>Download as Excel</button>
                    <button style={{marginLeft:"20px"}} onClick={downloadPDF}>Download as PDF</button>
                </div>
            )}
        </div>

        </div>
    );
}

export default App;