import { usePathname,useRouter } from "next/navigation";
import { PiTrashLight } from "react-icons/pi";

const DeleteChatButton = ({ chatId }) => {
    const router = useRouter();
    const pathname = usePathname().split("/")[2];

    const handleDelete = async () => {
        const hasConfirmed = confirm(
            "Are you sure you want to delete this chat and all messages?"
        );

        if (hasConfirmed) {
            try {
                const response = await fetch(`/api/chats/${pathname}`, {
                    method: "DELETE",
                });
        
                if (!response.ok) {
                    throw new Error(`Failed to delete chat: ${response.status}`);
                }

                router.push("/chat");
            } catch (error) {
                console.error("Error deleting chat:", error);
                alert("Failed to delete chat. Please try again.");
            }
        }
    };

    // Only show delete button if we're in the current chat
    if (pathname !== chatId) {
        return null;
    }

    return (
        <button
            title="Delete chat"
            className="mt-8 flex gap-4 text-[16px] font-light items-center cursor-pointer text-red-600 hover:text-red-400 active:text-red-500 transition-colors"
            onClick={handleDelete}
        >
            <PiTrashLight className="w-[20px] h-[20px] mob:w-[30px] mob:h-[30px]" />
            <span>Delete chat</span>
        </button>
    );
};

export default DeleteChatButton;
