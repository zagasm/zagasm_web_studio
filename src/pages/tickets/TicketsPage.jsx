import React, { useEffect, useState } from "react";
import SideBarNav from "../pageAssets/SideBarNav";
import Ticket from "../../component/Ticket/Ticket";
import TicketReceiptModal from "../../component/Ticket/TicketViewModal";
import { api, authHeaders } from "../../lib/apiClient";
import { showError } from "../../component/ui/toast";
import { useAuth } from "../auth/AuthContext";

const CACHE_KEY = "zagasm_tickets_cache_v1";

function TicketsPage() {
  const { token } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [error, setError] = useState(null);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [receiptOpen, setReceiptOpen] = useState(false);

  // load from cache first
  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) setTickets(parsed);
      } catch (_) {}
    }
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get("/api/v1/ticket/list", authHeaders(token));

      const list = res?.data?.data || [];
      setTickets(list);
      localStorage.setItem(CACHE_KEY, JSON.stringify(list));
    } catch (err) {
      console.error(err);
      setError("Unable to load your tickets right now.");
      showError("Unable to load your tickets right now.");
    } finally {
      setLoading(false);
      setInitialLoaded(true);
    }
  };

  const handleViewReceipt = (ticket) => {
    setSelectedTicket(ticket);
    setReceiptOpen(true);
  };

  const closeReceipt = () => {
    setReceiptOpen(false);
    setSelectedTicket(null);
  };

  const showEmpty = initialLoaded && !loading && tickets.length === 0;

  return (
    <div className="">
      <div className="tw:w-full tw:min-h-screen tw:bg-[#F5F5F7] tw:pt-6 tw:md:pt-24 tw:lg:px-4">
        <div className="row p-0">
          <div className="col account_section">
            <div className="tw:px-4 tw:py-4 tw:md:px-8 tw:md:py-8">
              <div className="tw:max-w-7xl tw:mx-auto tw:flex tw:flex-col tw:gap-6">
                {/* Header */}
                <div className="tw:flex tw:flex-col tw:gap-1">
                  <span className="tw:text-2xl tw:md:text-3xl tw:font-semibold tw:text-gray-900">
                    Tickets
                  </span>
                  <span className="tw:block tw:text-sm tw:md:text-base tw:text-gray-500">
                    Access all your event tickets and receipts in one place.
                  </span>
                </div>

                {/* Error state */}
                {error && (
                  <div className="tw:flex tw:items-center tw:justify-between tw:rounded-2xl tw:bg-red-50 tw:border tw:border-red-100 tw:px-4 tw:py-3 tw:text-sm tw:text-red-700">
                    <span>{error}</span>
                    <button
                      onClick={fetchTickets}
                      className="tw:text-xs tw:font-medium tw:underline"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Loading state */}
                {loading && (
                  <div className="row">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="col-12 col-sm-6 col-lg-4 mb-4">
                        <div className="tw:animate-pulse tw:h-40 tw:bg-gray-100 tw:rounded-3xl tw:shadow-sm tw:w-full" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty state */}
                {showEmpty && (
                  <div className="tw:mt-6 tw:flex tw:flex-col tw:items-center tw:justify-center tw:gap-3 tw:text-center tw:py-10 tw:bg-gray-50 tw:rounded-3xl">
                    <div className="tw:text-4xl">🎟️</div>
                    <p className="tw:text-base tw:font-medium tw:text-gray-900">
                      No tickets yet
                    </p>
                    <p className="tw:text-sm tw:text-gray-500 tw:max-w-md">
                      When you buy tickets to an event, they will appear here
                      with their receipt and details.
                    </p>
                  </div>
                )}

                {/* Tickets grid */}
                {!loading && tickets.length > 0 && (
                  <div className="row">
                    {tickets.map((ticket) => (
                      <div
                        key={ticket.ticket_id}
                        className="col-12 col-lg-6 col-xl-6 mb-4"
                      >
                        <Ticket
                          ticket={ticket}
                          onViewReceipt={() => handleViewReceipt(ticket)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Ticket / Receipt modal */}
      <TicketReceiptModal
        open={receiptOpen}
        onClose={closeReceipt}
        ticket={selectedTicket}
      />
    </div>
  );
}

export default TicketsPage;
