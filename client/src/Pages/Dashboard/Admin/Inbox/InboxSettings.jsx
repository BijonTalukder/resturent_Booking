import { useState, useEffect } from "react";
import { toast } from "sonner";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaFacebookMessenger } from "react-icons/fa";
import { useUpsertSettingMutation, useGetSettingQuery } from "../../../../redux/Feature/Admin/setting/settingApi";

const InboxSettings = () => {
  const [whatsapp, setWhatsapp] = useState("");
  const [messenger, setMessenger] = useState("");

  const { data: whatsappData } = useGetSettingQuery("inbox_whatsapp");
  const { data: messengerData } = useGetSettingQuery("inbox_messenger");
  const [upsertSetting, { isLoading }] = useUpsertSettingMutation();

  useEffect(() => {
    if (whatsappData?.data?.value) setWhatsapp(whatsappData.data.value);
    if (messengerData?.data?.value) setMessenger(messengerData.data.value);
  }, [whatsappData, messengerData]);

  const handleSave = async () => {
    try {
      await upsertSetting({ key: "inbox_whatsapp", value: whatsapp }).unwrap();
      await upsertSetting({ key: "inbox_messenger", value: messenger }).unwrap();
      toast.success("Inbox links saved successfully");
    } catch {
      toast.error("Failed to save inbox links");
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="neu-card p-6">
        <h1 className="text-xl font-bold text-[#373b43] mb-6">Inbox Settings</h1>
        <p className="text-sm text-[#6b7588] mb-6">
          Set the WhatsApp and Messenger links that will appear in the mobile inbox.
        </p>

        <div className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[#484f5c] mb-2">
              <IoLogoWhatsapp className="text-green-500 text-xl" />
              WhatsApp Link
            </label>
            <div className="neu-inset-sm rounded-xl overflow-hidden">
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="https://wa.me/123456789"
                className="w-full px-4 py-3 bg-transparent border-none outline-none text-sm text-[#484f5c] placeholder:text-[#b0b7c3]"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[#484f5c] mb-2">
              <FaFacebookMessenger className="text-blue-500 text-xl" />
              Messenger Link
            </label>
            <div className="neu-inset-sm rounded-xl overflow-hidden">
              <input
                type="text"
                value={messenger}
                onChange={(e) => setMessenger(e.target.value)}
                placeholder="http://m.me/yourpage"
                className="w-full px-4 py-3 bg-transparent border-none outline-none text-sm text-[#484f5c] placeholder:text-[#b0b7c3]"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={isLoading}
            className="neu-btn-primary w-full py-3 text-sm font-medium disabled:opacity-60"
          >
            {isLoading ? "Saving..." : "Save Links"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InboxSettings;
