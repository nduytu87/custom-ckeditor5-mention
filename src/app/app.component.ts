import { Component } from '@angular/core';
import { HttpClient, HttpXhrBackend } from '@angular/common/http';
import * as customEditor from '../build/ckeditor';
import { User } from './user';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'custom-ckeditor';
  private timeout?;
  public Editor = customEditor;
  public editorConfig = {
    //extraPlugins: [this.MentionLinks],
    fontSize: {
      options: [9, 10, 11, 12, 13, 14, 15],
      supportAllValues: true,
    },
    fontFamily: {
      options: [
        'default',
        'Ubuntu, Arial, sans-serif',
        'Ubuntu Mono, Courier New, Courier, monospace',
      ],
    },
    toolbar: {
      items: [
        'fontfamily',
        'fontSizeDropdown',
        'bold',
        'italic',
        'numberedList',
        'bulletedList',
        'link',
        'uploadImage',
        'insertTable',
      ],
    },

    mention: {
      feeds: [
        {
          marker: '@',
          feed: this.getFeedItems,
          minimumCharacters: 1,
          itemRenderer: this.customItemRenderer,
        },
      ],
    },
  };

  public onReady(editor) {
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
  }

  public getFeedItems(queryText: string) {
    const httpClient = new HttpClient(
      new HttpXhrBackend({ build: () => new XMLHttpRequest() })
    );

    return new Promise((resolve) => {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        httpClient
          .get<User[]>('https://jsonplaceholder.typicode.com/users')
          .subscribe((res) => {
            const result = res.map((item) => ({
              ...item,
              userId: item.id,
              id: `@${item.username}`,
            }));
            resolve(result);
          });
      }, 300);
    });
    /*const items = [
      {
        id: '@swarley',
        userId: '1',
        name: 'Barney Stinson',
        link: 'https://www.imdb.com/title/tt0460649/characters/nm0000439',
      },
      {
        id: '@lilypad',
        userId: '2',
        name: 'Lily Aldrin',
        link: 'https://www.imdb.com/title/tt0460649/characters/nm0004989',
      },
      {
        id: '@marshmallow',
        userId: '3',
        name: 'Marshall Eriksen',
        link: 'https://www.imdb.com/title/tt0460649/characters/nm0781981',
      },
      {
        id: '@rsparkles',
        userId: '4',
        name: 'Robin Scherbatsky',
        link: 'https://www.imdb.com/title/tt0460649/characters/nm1130627',
      },
      {
        id: '@tdog',
        userId: '5',
        name: 'Ted Mosby',
        link: 'https://www.imdb.com/title/tt0460649/characters/nm1102140',
      },
    ];
    return new Promise((resolve) => {
      debounce(() => {
        console.log('filter');
        const itemsToDisplay = items
          // Filter out the full list of all items to only those matching the query text.
          .filter((item) => {
            const searchString = queryText.toLowerCase();

            // Include an item in the search results if name or username includes the current user input.
            return (
              item.name.toLowerCase().includes(searchString) ||
              item.id.toLowerCase().includes(searchString)
            );
          })
          // Return 10 items max - needed for generic queries when the list may contain hundreds of elements.
          .slice(0, 10);

        resolve(itemsToDisplay);
      }, 300);
    });*/
  }
  public customItemRenderer(item) {
    const itemElement = document.createElement('span');

    itemElement.classList.add('custom-item');
    itemElement.id = `mention-list-item-id-${item.userId}`;
    itemElement.textContent = `${item.name} `;

    const usernameElement = document.createElement('span');

    usernameElement.classList.add('custom-item-username');
    usernameElement.textContent = item.id;

    itemElement.appendChild(usernameElement);

    return itemElement;
  }
}
