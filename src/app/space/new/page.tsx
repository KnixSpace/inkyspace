import SpaceCreationForm from "@/components/space/SpaceCreationForm";

export default function CreateSpacePage() {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold">Create a New Space</h1>
      <p className="text-gray-500 text-sm mb-4">
        Create a space to share your content with subscribers.
      </p>
      <SpaceCreationForm />
    </div>
  );
}
