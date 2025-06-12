import React from 'react';
import logo from '../../assets/zagasm_logo.png'; // Adjust path based on actual file location
// import './style.css';
function AllChats() {
    return (
        <div className="boxshadow-sm  rounded  mb-3 bg-white p-"  style={{ marginTop: '65px' }}>
            <div className="box-title border-bottom p-3" >
                <h2 className="m-0" style={{color: '#8000FF'}}>Chats</h2>
            </div>
            <div class="border-right col-lg-12 col-xl-12 px-0">
                <div class="osahan-chat-left">
                    <div class="position-relative icon-form-control p-3 border-bottom">
                        <i class="feather-search position-absolute"></i>
                        <input placeholder="Search messages" type="text" class="form-control" />
                    </div>
                    <div class="osahan-chat-list">
                        <div class="p-3 d-flex align-items-center border-bottom osahan-post-header overflow-hidden">
                            <div class="dropdown-list-image mr-3"><img class="rounded-circle" src="./src/assets/img/IMG_9488.jpeg" alt="" /></div>
                            <div class="font-weight-bold mr-1 overflow-hidden">
                                <div class="text-truncate">Ashley Briggs</div>
                                <div class="small text-truncate overflow-hidden text-black-50"><i class="feather-check text-primary"></i> Pellentesque semper ex diam, at tristique ipsum varius sed. Pellentesque non metus ullamcorper</div>
                            </div>
                            <span class="ml-auto mb-auto">
                                <div class="text-right text-muted pt-1 small">00:21PM</div>
                            </span>
                        </div>
                        <div class="p-3 d-flex align-items-center bg-light border-left border-primary  border-bottom osahan-post-header overflow-hidden">
                            <div class="dropdown-list-image mr-3"><img class="rounded-circle" src="./src/assets/img/IMG_9488.jpeg" alt="" /></div>
                            <div class="font-weight-bold mr-1 overflow-hidden">
                                <div class="text-truncate">Carl Jenkins
                                </div>
                                <div class="small text-truncate overflow-hidden text-black-50"><i class="feather-check"></i> Semper ex diam, at tristique ipsum varius sed. Pellentesque non metus ullamcorper</div>
                            </div>
                            <span class="ml-auto mb-auto">
                                <div class="text-right text-muted pt-1 small">00:21PM</div>
                            </span>
                        </div>
                        <div class="p-3 d-flex align-items-center border-bottom osahan-post-header overflow-hidden">
                            <div class="dropdown-list-image mr-3"><img class="rounded-circle" src="./src/assets/img/IMG_9488.jpeg" alt="" /></div>
                            <div class="font-weight-bold mr-1 overflow-hidden">
                                <div class="text-truncate">Bertha Martin
                                </div>
                                <div class="small text-truncate overflow-hidden text-black-50"><i class="feather-check text-primary"></i> Pellentesque semper ex diam, at tristique ipsum varius sed. Pellentesque non metus ullamcorper</div>
                            </div>
                            <span class="ml-auto mb-auto">
                                <div class="text-right text-muted pt-1 small">00:21PM</div>
                            </span>
                        </div>
                        <div class="p-3 d-flex align-items-center border-bottom osahan-post-header overflow-hidden">
                            <div class="dropdown-list-image mr-3"><img class="rounded-circle" src="./src/assets/img/IMG_9488.jpeg" alt="" /></div>
                            <div class="font-weight-bold mr-1 overflow-hidden">
                                <div class="text-truncate">Stacie Hall
                                </div>
                                <div class="small text-truncate overflow-hidden text-black-50"><i class="feather-check"></i> Semper ex diam, at tristique ipsum varius sed. Pellentesque non metus ullamcorper</div>
                            </div>
                            <span class="ml-auto mb-auto">
                                <div class="text-right text-muted pt-1 small">00:21PM</div>
                            </span>
                        </div>
                        <div class="p-3 d-flex align-items-center border-bottom osahan-post-header overflow-hidden">
                            <div class="dropdown-list-image mr-3">
                                <div class="dropdown-list-image mr-3 d-flex align-items-center bg-danger justify-content-center rounded-circle text-white">A</div>
                            </div>
                            <div class="font-weight-bold mr-1 overflow-hidden">
                                <div class="text-truncate">Ashley Briggs</div>
                                <div class="small text-truncate overflow-hidden text-black-50"><i class="feather-check text-primary"></i> Pellentesque semper ex diam, at tristique ipsum varius sed. Pellentesque non metus ullamcorper</div>
                            </div>
                            <span class="ml-auto mb-auto">
                                <div class="text-right text-muted pt-1 small">00:21PM</div>
                            </span>
                        </div>
                        <div class="p-3 d-flex align-items-center border-bottom osahan-post-header overflow-hidden">
                            <div class="dropdown-list-image mr-3"><img class="rounded-circle" src="./src/assets/img/IMG_9488.jpeg" alt="" /></div>
                            <div class="font-weight-bold mr-1 overflow-hidden">
                                <div class="text-truncate">Carl Jenkins
                                </div>
                                <div class="small text-truncate overflow-hidden text-black-50"><i class="feather-check"></i> Semper ex diam, at tristique ipsum varius sed. Pellentesque non metus ullamcorper</div>
                            </div>
                            <span class="ml-auto mb-auto">
                                <div class="text-right text-muted pt-1 small">00:21PM</div>
                            </span>
                        </div>
                        <div class="p-3 d-flex align-items-center border-bottom osahan-post-header overflow-hidden">
                            <div class="dropdown-list-image mr-3"><img class="rounded-circle" src="./src/assets/img/IMG_9488.jpeg" alt="" /></div>
                            <div class="font-weight-bold mr-1 overflow-hidden">
                                <div class="text-truncate">Bertha Martin
                                </div>
                                <div class="small text-truncate overflow-hidden text-black-50"><i class="feather-check text-primary"></i> Pellentesque semper ex diam, at tristique ipsum varius sed. Pellentesque non metus ullamcorper</div>
                            </div>
                            <span class="ml-auto mb-auto">
                                <div class="text-right text-muted pt-1 small">00:21PM</div>
                            </span>
                        </div>
                        <div class="p-3 d-flex align-items-center border-bottom osahan-post-header overflow-hidden">
                            <div class="dropdown-list-image mr-3">
                                <div class="dropdown-list-image mr-3 d-flex align-items-center bg-success justify-content-center rounded-circle text-white">S</div>
                            </div>
                            <div class="font-weight-bold mr-1 overflow-hidden">
                                <div class="text-truncate">Stacie Hall
                                </div>
                                <div class="small text-truncate overflow-hidden text-black-50"><i class="feather-check"></i> Semper ex diam, at tristique ipsum varius sed. Pellentesque non metus ullamcorper</div>
                            </div>
                            <span class="ml-auto mb-auto">
                                <div class="text-right text-muted pt-1 small">00:21PM</div>
                            </span>
                        </div>
                        <div class="p-3 d-flex align-items-center border-bottom osahan-post-header overflow-hidden">
                            <div class="dropdown-list-image mr-3"><img class="rounded-circle" src="./src/assets/img/IMG_9488.jpeg" alt="" /></div>
                            <div class="font-weight-bold mr-1 overflow-hidden">
                                <div class="text-truncate">Bertha Martin
                                </div>
                                <div class="small text-truncate overflow-hidden text-black-50"><i class="feather-check text-primary"></i> Pellentesque semper ex diam, at tristique ipsum varius sed. Pellentesque non metus ullamcorper</div>
                            </div>
                            <span class="ml-auto mb-auto">
                                <div class="text-right text-muted pt-1 small">00:21PM</div>
                            </span>
                        </div>
                        <div class="p-3 d-flex align-items-center border-bottom osahan-post-header overflow-hidden">
                            <div class="dropdown-list-image mr-3"><img class="rounded-circle" src="./src/assets/img/IMG_9488.jpeg" alt="" /></div>
                            <div class="font-weight-bold mr-1 overflow-hidden">
                                <div class="text-truncate">Stacie Hall
                                </div>
                                <div class="small text-truncate overflow-hidden text-black-50"><i class="feather-check"></i> Semper ex diam, at tristique ipsum varius sed. Pellentesque non metus ullamcorper</div>
                            </div>
                            <span class="ml-auto mb-auto">
                                <div class="text-right text-muted pt-1 small">00:21PM</div>
                            </span>
                        </div>
                        <div class="p-3 d-flex align-items-center border-bottom osahan-post-header overflow-hidden">
                            <div class="dropdown-list-image mr-3">
                                <div class="dropdown-list-image mr-3 d-flex align-items-center bg-danger justify-content-center rounded-circle text-white">A</div>
                            </div>
                            <div class="font-weight-bold mr-1 overflow-hidden">
                                <div class="text-truncate">Ashley Briggs</div>
                                <div class="small text-truncate overflow-hidden text-black-50"><i class="feather-check text-primary"></i> Pellentesque semper ex diam, at tristique ipsum varius sed. Pellentesque non metus ullamcorper</div>
                            </div>
                            <span class="ml-auto mb-auto">
                                <div class="text-right text-muted pt-1 small">00:21PM</div>
                            </span>
                        </div>
                        <div class="p-3 d-flex align-items-center border-bottom osahan-post-header overflow-hidden">
                            <div class="dropdown-list-image mr-3"><img class="rounded-circle" src="./src/assets/img/IMG_9488.jpeg" alt="" /></div>
                            <div class="font-weight-bold mr-1 overflow-hidden">
                                <div class="text-truncate">Carl Jenkins
                                </div>
                                <div class="small text-truncate overflow-hidden text-black-50"><i class="feather-check"></i> Semper ex diam, at tristique ipsum varius sed. Pellentesque non metus ullamcorper</div>
                            </div>
                            <span class="ml-auto mb-auto">
                                <div class="text-right text-muted pt-1 small">00:21PM</div>
                            </span>
                        </div>
                        <div class="p-3 d-flex align-items-center border-bottom osahan-post-header overflow-hidden">
                            <div class="dropdown-list-image mr-3"><img class="rounded-circle" src="./src/assets/img/IMG_9488.jpeg" alt="" /></div>
                            <div class="font-weight-bold mr-1 overflow-hidden">
                                <div class="text-truncate">Bertha Martin
                                </div>
                                <div class="small text-truncate overflow-hidden text-black-50"><i class="feather-check text-primary"></i> Pellentesque semper ex diam, at tristique ipsum varius sed. Pellentesque non metus ullamcorper</div>
                            </div>
                            <span class="ml-auto mb-auto">
                                <div class="text-right text-muted pt-1 small">00:21PM</div>
                            </span>
                        </div>
                        <div class="p-3 d-flex align-items-center osahan-post-header overflow-hidden">
                            <div class="dropdown-list-image mr-3">
                                <div class="dropdown-list-image mr-3 d-flex align-items-center bg-success justify-content-center rounded-circle text-white">S</div>
                            </div>
                            <div class="font-weight-bold mr-1 overflow-hidden">
                                <div class="text-truncate">Stacie Hall
                                </div>
                                <div class="small text-truncate overflow-hidden text-black-50"><i class="feather-check"></i> Semper ex diam, at tristique ipsum varius sed. Pellentesque non metus ullamcorper</div>
                            </div>
                            <span class="ml-auto mb-auto">
                                <div class="text-right text-muted pt-1 small">00:21PM</div>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default AllChats;
