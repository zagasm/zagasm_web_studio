import React from 'react';
import { Navbar, Nav, Form, FormControl, Badge, Dropdown, Image, Container } from 'react-bootstrap';
import logo from '../../assets/zagasm_logo.png';
import profileImg from '../../assets/img/IMG_9488.jpeg';
import userImg from '../../assets/img/IMG_9488.jpeg';
import p1 from '../../assets/img/p1.png';
import p2 from '../../assets/img/p2.png';
import p3 from '../../assets/img/p3.png';
import p4 from '../../assets/img/p4.png';
import './navStyle.css';
import MobileNav from './MobileNav';

const messageData = [p1, p2, p3, p4];

function AppNavbar() {
    return (
        <>
            <MobileNav />
            <Navbar bg="white" expand="lg" fixed="top" className="p-3 shadow-sm">
                <Container fluid>
                    <Navbar.Brand href="/">
                        <img src={logo} alt="logo" height="40" />
                    </Navbar.Brand>

                    <Form className="d-none d-sm-inline-block flex-grow-1 mx-4">
                        <FormControl
                            type="search"
                            placeholder="What's funny today? #Hashtag..."
                            className="border-0"
                        />
                    </Form>

                    <Nav className="me-auto">
                        <Nav.Link href="/jobs"><i className="feather-home nav-icon mr-2"></i></Nav.Link>
                        <Nav.Link href="/jobs"><i className="feather-plus-circle nav-icon mr-2"></i></Nav.Link>
                        <Nav.Link href="/jobs"><i className="feather-user-plus nav-icon"></i></Nav.Link>
                    </Nav>

                    <Nav className="ms-auto align-items-center">
                        {/* Messages */}
                        <Dropdown align="end">
                            <Dropdown.Toggle as="a" className="nav-link position-relative">
                                <i className="feather-message-square nav-icon" style={{ fontSize: '25px' }}></i>
                                <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                                    8
                                </Badge>
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="shadow-sm dropdown-menu-end">
                                <Dropdown.Header>Message Center</Dropdown.Header>
                                {messageData.map((img, index) => (
                                    <Dropdown.Item key={index} href="/messages" className="d-flex align-items-center">
                                        <div className="me-3 position-relative">
                                            <Image src={img} roundedCircle height={40} />
                                            <span className={`status-indicator position-absolute bottom-0 end-0 rounded-circle ${index % 2 === 0 ? 'bg-success' : index === 2 ? 'bg-warning' : 'bg-secondary'}`} style={{ width: '10px', height: '10px' }}></span>
                                        </div>
                                        <div>
                                            <div className="fw-bold text-truncate">Sample message content {index + 1}</div>
                                            <div className="small text-muted">Sender · {index + 1}h</div>
                                        </div>
                                    </Dropdown.Item>
                                ))}
                                <Dropdown.Divider />
                                <Dropdown.Item href="/messages" className="text-center text-muted small">Read More Messages</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        {/* Alerts */}
                        <Dropdown align="end" className="mx-2">
                            <Dropdown.Toggle as="a" className="nav-link position-relative">
                                <i className="feather-bell nav-icon" style={{ fontSize: '25px' }}></i>
                                <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                                    6
                                </Badge>
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="shadow-sm dropdown-menu-end">
                                <Dropdown.Header>Alerts Center</Dropdown.Header>
                                <Dropdown.Item href="/notifications" className="d-flex align-items-center">
                                    <div className="me-3">
                                        <div className="bg-primary rounded-circle d-flex justify-content-center align-items-center" style={{ width: '35px', height: '35px' }}>
                                            <i className="feather-download-cloud text-white"></i>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="small text-muted">Dec 12, 2019</div>
                                        <span className="fw-bold">New monthly report is ready!</span>
                                    </div>
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item href="/notifications" className="text-center text-muted small">Show All Alerts</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        {/* Profile */}
                        <Dropdown align="end">
                            <Dropdown.Toggle as="a" className="nav-link p-0">
                                <Image src={profileImg} roundedCircle height={40} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="shadow-sm dropdown-menu-end">
                                <div className="px-3 py-2 d-flex align-items-center">
                                    <Image src={userImg} roundedCircle height={40} className="me-2" />
                                    <div>
                                        <div className="fw-bold">Gurdeep Osahan</div>
                                        <div className="small text-muted">UI/UX Designer</div>
                                    </div>
                                </div>
                                <Dropdown.Divider />
                                <Dropdown.Item href="/profile"><i className="feather-edit me-2"></i>My Account</Dropdown.Item>
                                <Dropdown.Item href="/edit-profile"><i className="feather-user me-2"></i>Edit Profile</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item href="/sign-in"><i className="feather-log-out me-2"></i>Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
}

export default AppNavbar;
