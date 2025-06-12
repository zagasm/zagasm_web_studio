import React from 'react';
import Navbar from '../pageAssets/Navbar';
import logo from '../../assets/zagasm_logo.png';
import SideBarNav from '../pageAssets/sideBarNav';
import RightBarComponent from '../pageAssets/rightNav';
import AllChats from '../../component/chats/rightbarChat';
import './style.css'
function Chat() {
    return (
        <div className="py-4">
            <div className="container-fluid p-0" >
                <SideBarNav />
                <div className="row offset-xl-2 offset-lg-1 offset-md-1" >
                    <main className="col col-xl-9 order-xl-2 col-lg-8 order-lg-1 col-md-12 col-sm-12 col-12 main_container bg-dange   ">
                        <div class="box shadow-sm rounded bg-white mb-3 osahan-chat" >
                            <h5 class="pl-3 pt-3 pr-3 border-bottom mb-0 pb-3" style={{ color: '#8000FF' }}>Messaging</h5>
                            <div class="row m-0">
                                <div class="col-lg-12 col-xl-12 px-0">
                                    <div class="p-3 d-flex align-items-center  border-bottom osahan-post-header">
                                        <div class="font-weight-bold mr-1 overflow-hidden">
                                            <div class="text-truncate">Carl Jenkins
                                            </div>
                                            <div class="small text-truncate overflow-hidden text-success"><i className='fa fa-circle text-success' style={{ fontSize: '7px', marginTop: '-10px' }}></i> online</div>
                                        </div>
                                        <span class="ml-auto">
                                            <button type="button" class="btn btn-light btn-sm rounded">
                                                <i class="feather-phone"></i>
                                            </button>
                                            <button type="button" class="btn btn-light btn-sm rounded">
                                                <i class="feather-video"></i>
                                            </button>
                                            <div class="btn-group">
                                                <button type="button" class="btn btn-light btn-sm rounded" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    <i class="feather-more-vertical"></i>
                                                </button>
                                                <div class="dropdown-menu dropdown-menu-right">
                                                    <button class="dropdown-item" type="button"><i class="feather-trash"></i> Delete</button>
                                                    <button class="dropdown-item" type="button"><i class="feather-x-circle"></i> Turn Off</button>
                                                </div>
                                            </div>
                                        </span>
                                    </div>
                                    <div class="osahan-chat-box p-3 border-top border-bottom bg-light" style={{ minHeight: 'calc(100vh - 400px)' }}>
                                        <div class="text-center my-3">
                                            <span class="px-3 py-2 small bg-white shadow-sm  rounded">DEC 21, 2020</span>
                                        </div>
                                        <div class="d-flex align-items-center osahan-post-header mb-4">
                                            <div class="dropdown-list-image mr-1 mb-auto">
                                                <img class="rounded-circle" src="./src/assets/img/IMG_9488.jpeg" alt="" />
                                            </div>
                                            <div class="alert-primary p-2 mt-3 " style={{ borderRadius: ' 2px 10px 10px 10px' }}>
                                                <b class="text-truncate b mb-0">Carl Jenkins </b>
                                                <p className='text-dark'>Hi Marie
                                                    welcome to Live Chat! My name is Jason. How can I help you today?
                                                    <a href="#"><span class="__cf_email__" data-cfemail="d9b0b8b4b6aab8b1b8b799beb4b8b0b5f7bab6b4">[email&#160;protected]</span></a>
                                                </p>
                                            </div>
                                            {/* <span class="ml-auto mb-auto">
                                                <div class="text-right text-muted pt-1 small">00:21PM</div>
                                            </span> */}
                                        </div>
                                        {/* <div class="text-center my-3">
                                            <span class="px-3 py-2 small bg-white shadow-sm rounded">DEC 22, 2020</span>
                                        </div> */}
                                        <div class="d-flex align-items-center osahan-post-header text-right float-right " >
                                            {/* <span class="mr-auto mr-auto">
                                                <div class="text-right text-muted pt-1 small">00:21PM</div>
                                            </span> */}
                                            <div class="mr-1 mt-4" >
                                                {/* <div class="text-truncate h6 mb-0">
                                                    Jack P. Angulo
                                                </div> */}
                                                {/* <span>time</span> */}
                                                <p className='text-dark p-2 ' style={{ borderRadius: ' 15px 5px 15px 15px', background: '#e4cff881', color: 'white' }}>Hi, I wanted to check my order status. My order number is 0009483021 😀</p>
                                            </div>
                                            <div class="dropdown-list-image mr-3 mb-auto">
                                                <img class="rounded-circle" src="./src/assets/img/IMG_9488.jpeg" alt="" />
                                            </div>
                                        </div>


                                    </div>
                                    <div class="w-100 border-top border-bottom">
                                        <textarea placeholder="Write a message…" class="form-control border-0 p-3 shadow-none" rows="2"></textarea>
                                    </div>
                                    <div class="p-3 d-flex align-items-center">
                                        <div class="overflow-hidden">
                                            <button type="button" class="btn btn-light btn-sm rounded">
                                                <i class="feather-emoji"></i>
                                            </button>
                                            <button type="button" class="btn btn-light btn-sm rounded">
                                                <i class="feather-paperclip"></i>
                                            </button>
                                            <button type="button" class="btn btn-light btn-sm rounded">
                                                <i class="feather-camera"></i>
                                            </button>
                                        </div>
                                        <span class="ml-auto">
                                            <button type="button" class="btn  btn-sm rounded sendMsgBtn">
                                                <i class="feather-send"></i> Send
                                            </button>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                    <RightBarComponent>
                        <AllChats />
                    </RightBarComponent>
                </div>
            </div>
        </div>
    );
}
export default Chat;