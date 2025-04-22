const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const truncateText = (text: string, maxLength: number) => {
  if (!text) return "";
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const statusTranslations: Record<string, string> = {
  verified: "Vérifié",
  pending_verification: "En attente de vérification",
  rejected: "Rejeté",
  pending: "En attente",
  pending_to_niv2: "Niv 1",
  success: "Demande traitée",
  pending_to_niv3: "Niv 2",
};

const statusClasses: Record<string, string> = {
  draft: "text-muted bg-muted-subtle",
  toBeValidated: "text-info bg-info-subtle",
  validated: "text-primary bg-primary-subtle",
  published: "text-success bg-success-subtle",
  expired: "text-secondary bg-secondary-subtle",
  archived: "text-muted bg-outline", // btn-warning
  rejected: "text-danger bg-danger-subtle",
};

const onRowClicked = (event: any) => {
  const messageId = event.data.id;
  if (messageId) {
    window.location.href = `/dashboard/user/messages/${messageId}`;
  }
};

const getRowStyle = (params: any) => {
  const status = params.data.statutRecipient;
  if (status === "Lu") {
    return { backgroundColor: "#F2F2F2" };
  }
  return { backgroundColor: "#fff" };
};

const rowClassRules = {
  "received-message": (params: any) => params.data.statutRecipient === "Reçu",
};

export const functions = {
  formatDate,
  onRowClicked,
  getRowStyle,
  statusTranslations,
  statusClasses,
  rowClassRules,
  truncateText,
};
