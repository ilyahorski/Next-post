import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { useMobileCheck } from "~/utils/hooks/useMobileCheck";
import { IoClose } from "react-icons/io5";

const CustomFileUpload = ({
  showFileUpload,
  setShowFileUpload,
  fileUploadRef,
  messageRef,
  handleChange,
  onUpload,
  onSelect,
  onClear,
  register,
  errors,
  resetForm,
}) => {
  const isMobile = useMobileCheck();

  const onUploadHandler = (event) => {
    onUpload(event);
    resetForm();
  };

  const fileUploadPT = {
    root: "w-full",
    content: {
      className:
        "p-1 !border !border-zinc-800 !bg-zinc-800 rounded-b-lg max-h-[500px] overflow-y-auto",
      progressbar: {
        className:
          "!overflow-hidden !relative !border-0 !h-6 !bg-gray-200 !rounded-md dark:!bg-gray-800 !rounded",
      },
      file: {
        className:
          "flex !items-center !justify-between !p-2 !border-b !border-gray-200 last:border-b-0",
        removeButton: {
          root: "text-red-500 hover:text-red-700",
        },
      },
    },
    buttonbar: "!flex !justify-between mt-4 mb-2 !bg-zinc-800 !border-zinc-800",
    emptyContent: "text-center p-4 text-gray-800",
  };

  const dialogPT = {
    root: { className: "w-11/12 md:w-2/3 lg:w-1/2 !bg-gray-800" },
    header: { className: "!bg-zinc-950 !text-white p-4 rounded-t-lg" },
    content: { className: "!bg-zinc-900 p-1 rounded-b-lg" },
    closeButton: { className: "!text-white hover:!text-gray-300" },
  };

  const itemTemplate = (file, props) => {
    return (
      <div className="flex w-full relative">
        <img
          className="h-20"
          alt={file.name}
          role="presentation"
          src={file.type.split('/')[0] === ('image' || 'video') ? file.objectURL : '/assets/media.png'}
          width={100}
        />
        <div className="flex px-2 h-20 w-7/12 flex-col justify-between">
          <p className="flex text-left w-10/12 truncate text-sm">{file.name}</p>
          <div className="flex justify-between w-full">
            <span className="h-6 text-sm">{props.formatSize}</span>
            <button
              type="button"
              className="absolute bottom-0 right-0 p-1 text-red-600"
              onClick={() => props.onRemove(file)}
            >
              <IoClose />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog
      visible={showFileUpload}
      onHide={() => setShowFileUpload(false)}
      header="Upload Media"
      pt={dialogPT}
    >
      <div className="p-1">
        <textarea
          title={`Write your message here`}
          ref={messageRef}
          id={"message"}
          className="w-full min-h-[48px] h-[48px] pl-1 max-h-32 bg-white dark:bg-gray-600/10 outline-none rounded-lg focus:border-[1px] focus:border-primary-50"
          placeholder={"Message"}
          onChange={handleChange}
          onClick={handleChange}
          onSelect={handleChange}
          rows={4}
          cols={50}
          maxLength={4000}
          {...register("message", {
            required: false,
            maxLength: 4000,
          })}
        />
        {errors.message && (
          <p className="mt-1 text-primary-500">
            {errors.message.type === "maxLength" && `Max length is 4000 char.`}
          </p>
        )}
      </div>
      <FileUpload
        ref={fileUploadRef}
        name="media"
        url={`${process.env.NEXT_PUBLIC_SERVER_URL}/upload-media`}
        accept="*/*"
        maxFileSize={100000000}
        onUpload={onUploadHandler} 
        onSelect={onSelect}
        onClear={onClear}
        removeButton={false}
        chooseOptions={{
          label: "Files",
          className:
            "px-3 w-2/5 py-1.5 !text-sm !items-center !justify-between cursor-pointer !bg-gray-950 !text-white rounded-md hover:!bg-gray-800 transition-colors duration-200",
        }}
        uploadOptions={{
          label: "Send",
          className:
            "px-3 w-2/5 py-1.5 !text-sm !items-center !justify-center !bg-gray-950 !text-white !cursor-pointer rounded-md hover:!bg-gray-800 transition-colors duration-200",
        }}
        cancelOptions={{
          iconOnly: isMobile,
          className:
            "!hidden px-3 w-1/4 py-1.5 !text-sm !bg-gray-950 !text-white rounded-md hover:!bg-gray-800 transition-colors duration-200",
        }}
        multiple
        auto={false}
        pt={fileUploadPT}
        emptyTemplate={
          <p className="m-0">Drag and drop files here to upload.</p>
        }
        itemTemplate={itemTemplate}
      />
    </Dialog>
  );
};

export default CustomFileUpload;
