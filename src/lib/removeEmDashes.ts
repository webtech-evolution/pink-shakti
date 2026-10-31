export const removeEmDashes = () => {
  const cleanTextNodes = (root: Node) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);

    let node: Node | null;

    while ((node = walker.nextNode())) {
      if (node.nodeValue?.includes("—")) {
        node.nodeValue = node.nodeValue.replace(/—/g, "");
      }
    }
  };

  // Clean existing content
  cleanTextNodes(document.body);

  // Clean anything React adds later
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          if (node.nodeValue?.includes("—")) {
            node.nodeValue = node.nodeValue.replace(/—/g, "");
          }
        } else {
          cleanTextNodes(node);
        }
      });

      if (mutation.type === "characterData") {
        const node = mutation.target;

        if (node.nodeValue?.includes("—")) {
          node.nodeValue = node.nodeValue.replace(/—/g, "");
        }
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  return () => observer.disconnect();
};
